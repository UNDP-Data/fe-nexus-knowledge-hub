import { Link } from '@tanstack/react-router';
import { Button } from '@undp/design-system-react/Button';
import {
  Header,
  HeaderActions,
  HeaderLogoUnit,
  HeaderMainNavUnit,
  HeaderMenuUnit,
} from '@undp/design-system-react/Header';
import { SESSION_STORAGE_NAME } from '@/constants';
import { isAdmin } from '@/utils/isAdmin';

export default function HeaderEl() {
  const isUserAdmin = isAdmin();
  return (
    <Header>
      <HeaderLogoUnit hyperlink='/' siteName='Nexus Knowledge Hub' siteSubName='UNDP' />
      <HeaderMainNavUnit>
        <HeaderMenuUnit>
          <Link to='/'>Home</Link>
          <Link to='/all-resources'>All Resources</Link>
          <Link to='/add-resource'>Add Resource</Link>
        </HeaderMenuUnit>
      </HeaderMainNavUnit>
      {isUserAdmin && (
        <HeaderActions>
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
        </HeaderActions>
      )}
    </Header>
  );
}
