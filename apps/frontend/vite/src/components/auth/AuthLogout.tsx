
import React, { useEffect } from 'react';
import { useAuth } from "contexts/authContext"

const AuthLogout = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut()
  }, []);

  return null;
};

export default AuthLogout;