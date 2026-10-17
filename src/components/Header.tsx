import { Link } from '@tanstack/react-router';
import { Button } from '@undp/design-system-react/Button';
import {
  Header,
  HeaderActions,
  HeaderLogoUnit,
  HeaderMainNavUnit,
  HeaderMenuUnit,
} from '@undp/design-system-react/Header';
import { Input } from '@undp/design-system-react/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@undp/design-system-react/Popover';
import { P } from '@undp/design-system-react/Typography';
import MD5 from 'crypto-js/md5';
import { useState } from 'react';
import { HASHED_KEY, SESSION_STORAGE_NAME } from '@/constants';

export default function HeaderEl() {
  const password = sessionStorage.getItem(SESSION_STORAGE_NAME);
  const hash = password ? MD5(password).toString() : '';
  const [passwordValue, setPasswordValue] = useState('');
  return (
    <Header>
      <HeaderLogoUnit hyperlink='/' siteName='Nexus Knowledge Hub' siteSubName='UNDP' />
      <HeaderMainNavUnit>
        <HeaderMenuUnit>
          <Link to='/'>Home</Link>
          <Link to='/all-reports'>All Reports</Link>
          <Link to='/add-report'>Add Report</Link>
        </HeaderMenuUnit>
      </HeaderMainNavUnit>
      <HeaderActions>
        {hash === HASHED_KEY ? (
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
        ) : (
          <Popover>
            <PopoverTrigger>
              <Button variant='outline' size='sm' padding='sm'>
                Login
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <div className='flex flex-col gap-4'>
                  <P marginBottom='none'>Enter password</P>
                  <Input
                    id='password'
                    placeholder='Enter password'
                    type='password'
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                  <Button
                    variant='primary'
                    disabled={MD5(passwordValue).toString() !== HASHED_KEY}
                    onClick={() => {
                      sessionStorage.setItem('nexus-knowledge-hub-password', passwordValue);
                      window.location.reload();
                    }}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </HeaderActions>
    </Header>
  );
}
