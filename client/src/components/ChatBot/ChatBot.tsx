import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: #115E59;
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
`;

const Message = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  background: ${props => props.$isUser ? '#115E59' : '#e9ecef'};
  color: ${props => props.$isUser ? 'white' : '#212529'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 10px;
  background: #f8f9fa;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  outline: none;
  &:focus {
    border-color: #115E59;
  }
`;

const SendButton = styled.button`
  background: #115E59;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #0d4a45;
  }
`;

const LoginPrompt = styled.div`
  padding: 20px;
  text-align: center;
  background: #ffffff;
  border-radius: 10px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoginButton = styled.button`
  background: #115E59;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  &:hover {
    background: #0d4a45;
  }
`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { 
      text: "👋 Hi! I'm your ResumeTitan Assistant. I can help you with resume writing, interview preparation, and career advice. How can I assist you today?", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const token = await getToken();
      const response = await axios.post('http://localhost:3001/chat', 
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogin = () => {
    navigate('/sign-in');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#115E59',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}
      >
        <ChatIcon style={{ width: '30px', height: '30px' }} />
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <ChatContainer>
        <ChatHeader>
          <ChatIcon style={{ width: '24px', height: '24px' }} />
          <span>ResumeTitan Assistant</span>
        </ChatHeader>
        <LoginPrompt>
          <h3>Welcome to ResumeTitan Assistant!</h3>
          <p>Please sign in to use the chatbot and get personalized resume and career advice.</p>
          <LoginButton onClick={handleLogin}>Sign In</LoginButton>
        </LoginPrompt>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatIcon style={{ width: '24px', height: '24px' }} />
        <span>ResumeTitan Assistant</span>
      </ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index} $isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        {isLoading && (
          <Message $isUser={false}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', background: '#115E59', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
              <div style={{ width: '8px', height: '8px', background: '#115E59', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
              <div style={{ width: '8px', height: '8px', background: '#115E59', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
            </div>
          </Message>
        )}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInput>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          <SendIcon style={{ width: '20px', height: '20px' }} />
        </SendButton>
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatBot; 