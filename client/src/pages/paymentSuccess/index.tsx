import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserId } from '../../state/authReducer';
import { reloadUser } from 'api/resume';

const SuccessPage = () => {
  const token = useSelector((state: any) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reload user
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await reloadUser(token);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          dispatch(setUserId(data.userId));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
    setTimeout(function() {
      navigate('/dashboard');
    }, 3000);
  }, []);

  return (
    <div className="mx-auto p-4 min-h-screen h-screen">
      <h1 className="text-3xl font-bold">Success!</h1>
      <p className="text-gray-600 text-sm">Taking you to ResumeTitan...</p>        
    </div>
  );
};

export default SuccessPage;
