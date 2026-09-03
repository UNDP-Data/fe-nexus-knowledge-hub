import { Link } from '@tanstack/react-router';
import {
  Header,
  HeaderLogoUnit,
  HeaderMainNavUnit,
  HeaderMenuUnit,
} from '@undp/design-system-react/Header';

export default function HeaderEl() {
  return (
    <Header>
      <HeaderLogoUnit hyperlink='/' siteName='Nexus Knowledge Hub' siteSubName='UNDP' />
      <HeaderMainNavUnit>
        <HeaderMenuUnit>
          <Link to='/'>Home</Link>
          <Link to='/all-reports'>All Reports</Link>
        </HeaderMenuUnit>
      </HeaderMainNavUnit>
    </Header>
  );
}
