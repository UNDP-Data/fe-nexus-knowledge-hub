import { Footer, FooterCopyrightUnit, FooterLogoUnit } from '@undp/design-system-react/Footer';

export default function FooterEl() {
  return (
    <Footer>
      <FooterLogoUnit />
      <FooterCopyrightUnit>
        <a
          href='https://www.linkedin.com/company/dacunnexusacademy/'
          target='_blank'
          rel='noopener'
          className='hover:opacity-70'
        >
          Follow us on LinkedIn
        </a>
      </FooterCopyrightUnit>
    </Footer>
  );
}
