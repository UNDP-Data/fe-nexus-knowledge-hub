import { createLazyRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@undp/design-system-react/Button';
import { Input } from '@undp/design-system-react/Input';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H4, P } from '@undp/design-system-react/Typography';
import { MD5 } from 'crypto-js';
import { useState } from 'react';
import { HASHED_KEY, SESSION_STORAGE_NAME } from '@/constants';
import { isAdmin } from '@/utils/isAdmin';

export function LoginPage() {
  const isUserAdmin = isAdmin();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState('');
  const [isError, setIsError] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordValue.trim() === '') return;
    if (MD5(passwordValue).toString() !== HASHED_KEY) {
      setIsError(true);
      return;
    }
    setIsError(false);
    sessionStorage.setItem(SESSION_STORAGE_NAME, passwordValue);
    navigate({ to: '/', reloadDocument: true });
  };
  return (
    <div className='w-full px-8'>
      <div className='mx-auto mt-10 w-full max-w-105 bg-surface p-8'>
        <H4 weight='bold' marginBottom='none'>
          Login
        </H4>
        <Spacer size='2xl' />
        {isUserAdmin ? (
          <>
            <P>You are already logged in as an admin.</P>
            <Spacer size='2xl' />
            <Button
              variant='outline'
              size='sm'
              padding='sm'
              onClick={() => {
                sessionStorage.removeItem(SESSION_STORAGE_NAME);
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <P marginBottom='none'>Enter password</P>
            <Spacer size='xl' />
            <Input
              id='password'
              placeholder='Enter password'
              type='password'
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <Spacer size='3xl' />
            <Button
              variant='primary'
              type='submit'
              disabled={passwordValue.trim() === ''}
              onClick={() => {}}
            >
              Login
            </Button>
            {isError && <P className='mt-4 text-error'>Incorrect password</P>}
          </form>
        )}
      </div>
    </div>
  );
}

export const Route = createLazyRoute('/login')({
  component: LoginPage,
});
