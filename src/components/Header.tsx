import { Link } from '@tanstack/react-router';
import { ExternalLink } from '@undp/design-system-react/AnimatedIcons';
import { Button } from '@undp/design-system-react/Button';
import {
  Header,
  HeaderActions,
  HeaderLogoUnit,
  HeaderMainNavUnit,
  HeaderMenuUnit,
} from '@undp/design-system-react/Header';
import { ChevronRight } from 'lucide-react';
import { SESSION_STORAGE_NAME } from '@/constants';
import { isAdmin } from '@/utils/isAdmin';

export default function HeaderEl() {
  const isUserAdmin = isAdmin();
  return (
    <Header>
      <HeaderLogoUnit
        hyperlink='/'
        siteName='Nexus Knowledge Hub'
        siteSubName='Crisis'
        siteSubNameUrl='https://www.undp.org/crisis'
      />
      <HeaderMainNavUnit>
        <HeaderMenuUnit>
          <Link to='/all-resources' className='flex items-center gap-1'>
            All Resources <ChevronRight className='block text-primary md:hidden' />
          </Link>
          <Link to='/add-resource' className='flex items-center gap-1'>
            Add Resource <ChevronRight className='block text-primary md:hidden' />
          </Link>
          <a
            href='https://www.undp.org/crisis/academy/nexus'
            target='_blank'
            rel='noopener'
            className='group flex items-center gap-1'
          >
            Nexus Academy
            <div className='h-4 w-4 items-center'>
              <ExternalLink size={32} className='-mt-3.25' />
            </div>
          </a>
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
