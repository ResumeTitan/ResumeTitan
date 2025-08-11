import React, { useState, useRef, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import api, { setTokenFunction } from 'api/actions';
import { Message } from './types';
import { MAX_CHARS, MAX_RESPONSE_CHARS, MAX_MESSAGES, INITIAL_MESSAGE } from './constants';
import {
  ChatContainer,
  ChatHeader,
  HeaderLeft,
  CloseButton,
  ChatMessages,
  Message as StyledMessage,
  ChatInput,
  InputContainer,
  Input,
  CharCounter,
  SendButton,
  LoginPrompt,
  LoginButton,
  LoadingDots,
  LoadingDot
} from './styles';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

  const truncateMessage = (message: string): string => {
    if (message.length <= MAX_RESPONSE_CHARS) return message;
    return message.slice(0, MAX_RESPONSE_CHARS) + '...';
  };

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => {
      const newMessages = [...prev, { text, isUser }];
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES);
      }
      return newMessages;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to detect potential hallucination patterns
  const detectHallucination = (response: string): boolean => {
    const hallucinationPatterns = [
      /design\s+tab/i,
      /font\s+settings/i,
      /theme\s+editor/i,
      /customization\s+panel/i,
      /style\s+options/i,
      /format\s+menu/i,
      /appearance\s+settings/i,
      /visual\s+editor/i,
      /design\s+mode/i,
      /styling\s+options/i,
      /font\s+dropdown/i,
      /font\s+menu/i,
      /change\s+font/i,
      /font\s+selection/i,
      /typography\s+settings/i,
      /text\s+formatting/i,
      /font\s+customization/i
    ];
    
    return hallucinationPatterns.some(pattern => pattern.test(response));
  };

  // Function to provide fallback response for hallucination
  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('font') || lowerMessage.includes('design') || lowerMessage.includes('style')) {
      return "Font customization is not currently available in ResumeTitan. Our templates use professional, ATS-friendly fonts optimized for ATS systems. For more information about our formatting options, see the 'Customization & Formatting' section in our [Getting Started Guide](/docs/getting-started).";
    }
    
    if (lowerMessage.includes('resume')) {
      return "I don't have specific information about that resume feature. Please check our [Resume Guide](/docs/resume) for detailed instructions and tips.";
    }
    
    if (lowerMessage.includes('interview')) {
      return "I don't have specific information about that interview feature. Please check our [Interview Guide](/docs/interview) for comprehensive interview preparation help.";
    }
    
    if (lowerMessage.includes('cover letter')) {
      return "I don't have specific information about that cover letter feature. Please check our [Cover Letter Guide](/docs/cover-letter) for step-by-step guidance.";
    }
    
    if (lowerMessage.includes('documentation') || lowerMessage.includes('docs') || lowerMessage.includes('guide')) {
      return "Our documentation includes: [Getting Started Guide](/docs/getting-started) for basics, [Resume Guide](/docs/resume) for resume help, [Interview Guide](/docs/interview) for interview prep, and [Cover Letter Guide](/docs/cover-letter) for cover letters. Which would you like to learn more about?";
    }
    
    return "I don't have specific information about that. Please check our [Getting Started Guide](/docs/getting-started) for general help, or contact our support team at info@resumetitan.com for assistance.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: userMessage });
      let responseText = response.data.response;
      
      // Check for potential hallucination
      if (detectHallucination(responseText)) {
        responseText = getFallbackResponse(userMessage);
      }
      
      const truncatedResponse = truncateMessage(responseText);
      addMessage(truncatedResponse, false);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInput(value);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="chat-bot-button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#115E59',
          color: 'white',
          border: '3px solid white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(17, 94, 89, 0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(17, 94, 89, 0.4)';
          e.currentTarget.style.background = '#0d4a45';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(17, 94, 89, 0.3)';
          e.currentTarget.style.background = '#115E59';
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
          <HeaderLeft>
            <ChatIcon style={{ width: '24px', height: '24px' }} />
            <span>ResumeTitan Assistant</span>
          </HeaderLeft>
          <CloseButton onClick={() => setIsOpen(false)}>
            <CloseIcon style={{ width: '20px', height: '20px' }} />
          </CloseButton>
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
        <HeaderLeft>
          <ChatIcon style={{ width: '24px', height: '24px' }} />
          <span>ResumeTitan Assistant</span>
        </HeaderLeft>
        <CloseButton onClick={() => setIsOpen(false)}>
          <CloseIcon style={{ width: '20px', height: '20px' }} />
        </CloseButton>
      </ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <StyledMessage key={index} $isUser={message.isUser}>
            {message.isUser ? (
              message.text
            ) : (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            )}
          </StyledMessage>
        ))}
        {isLoading && (
          <StyledMessage $isUser={false}>
            <LoadingDots>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.4} />
            </LoadingDots>
          </StyledMessage>
        )}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInput>
        <InputContainer>
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={MAX_CHARS}
          />
          <SendButton onClick={handleSend} disabled={isLoading}>
            <SendIcon style={{ width: '20px', height: '20px' }} />
          </SendButton>
        </InputContainer>
        <CharCounter>
          {input.length}/{MAX_CHARS} characters
        </CharCounter>
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatBot;
