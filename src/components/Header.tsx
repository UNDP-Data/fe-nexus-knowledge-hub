import { ExternalLink } from '@undp/design-system-react/AnimatedIcons';
import { Button } from '@undp/design-system-react/Button';
import {
  Header,
  HeaderActions,
  HeaderLogoUnit,
  HeaderMainNavUnit,
  HeaderMenuLink,
  HeaderMenuUnit,
} from '@undp/design-system-react/Header';
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
          <HeaderMenuLink href='/all-resources'>All Resources</HeaderMenuLink>
          <HeaderMenuLink href='/add-resource'>Add Resource</HeaderMenuLink>
          <HeaderMenuLink
            href='https://www.undp.org/crisis/academy/nexus'
            target='_blank'
            showArrowInMobile={false}
          >
            <div className='group flex items-center gap-1'>
              Nexus Academy
              <div className='h-4 w-4 items-center'>
                <ExternalLink size={32} className='-mt-3.25' />
              </div>
            </div>
          </HeaderMenuLink>
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
