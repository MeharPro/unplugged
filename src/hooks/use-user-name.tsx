
import { useState, useEffect } from 'react';

// Define UserName interface for better type safety
interface UserName {
  firstName: string;
  lastName: string;
}

// Define the return type for better type safety
type UseUserNameReturn = [
  UserName,
  (firstName: string, lastName: string) => void
];

const useUserName = (): UseUserNameReturn => {
  const [userName, setUserName] = useState<UserName>({
    firstName: localStorage.getItem('unplugged_user_first_name') || 'Explorer',
    lastName: localStorage.getItem('unplugged_user_last_name') || ''
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName({
        firstName: localStorage.getItem('unplugged_user_first_name') || 'Explorer',
        lastName: localStorage.getItem('unplugged_user_last_name') || ''
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUserName = (firstName: string, lastName: string = '') => {
    localStorage.setItem('unplugged_user_first_name', firstName);
    localStorage.setItem('unplugged_user_last_name', lastName);
    
    setUserName({ firstName, lastName });
  };

  return [userName, updateUserName];
};

export default useUserName;
