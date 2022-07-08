import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from "contexts/authContext"

const OauthLogin = () => {

  const [params] = useSearchParams();
  const { federatedLogin } = useAuth();

  const authorizationCode = params.get('code')

  useEffect(() => {
    if (authorizationCode) {
      federatedLogin(authorizationCode)
    }
  }, [])

  return <>Redirecting...</>;
};

export default OauthLogin;