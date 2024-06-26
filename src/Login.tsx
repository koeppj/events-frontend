import { Form, Input, Button } from 'reactstrap';
import { SessionType, useAppContext } from './appcontext';
import { useState } from 'react';
import { login } from './Backend'
import { CcgConfig,BoxCcgAuth, BoxClient } from 'box-typescript-sdk-gen'; 
import { Navigate, useLocation, useNavigate } from 'react-router-dom';


export default function Login() {
  const { contextLogin } = useAppContext();
  const location = useLocation()
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  let from = location.state?.from?.pathname || '/';

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setMessage('Logging in...');
    const loginResponse  = await login(email, password);
    if (loginResponse.success) {
      const config = new CcgConfig({
        userId: loginResponse.backendData?.boxUser.id || '',
        enterpriseId: loginResponse.backendData?.boxConfig.enterprise_id || '',
        clientId: loginResponse.backendData?.boxConfig.client_id || '',
        clientSecret: loginResponse.backendData?.boxConfig.client_secret || '',
      });
      console.log('Login response:', JSON.stringify(loginResponse, null, 2));
      const ccgAuth = new BoxCcgAuth({ config: config});
      const boxClient = new BoxClient({auth: ccgAuth});
      const sessionType: SessionType = {
        loggedIn: true,
        boxUser: loginResponse.backendData?.boxUser,
        jwtToken: loginResponse.backendData?.accessToken,
        boxClient: boxClient
      }
      setMessage("Login successful");
      contextLogin(sessionType);
      navigate(from, { replace: true });
    } else {
      setMessage(loginResponse.responseMessage);
      const sessionType: SessionType = {
        loggedIn: false,
        boxUser: undefined,
        jwtToken: undefined,
        boxClient: undefined
      }
    }
  }

  return (
    <Form className='text-center' onSubmit={handleLogin}>
        <Input type="email" className="form-control mb-3" onChange={handleEmailChange} placeholder='Enter Login'/>
        <Input type="password" className="form-control mb-3" onChange={handlePasswordChange} placeholder='Enter Password'/>
        <Button type="submit" className="btn btn-primary">Login</Button>
        <p>{message}</p>
    </Form>
  );
}
