import {
  Footer,
  FooterCopyrightUnit,
  FooterLogoUnit,
  FooterSocialMediaIconUnit,
} from '@undp/design-system-react/Footer';

export default function FooterEl() {
  return (
    <Footer>
      <FooterLogoUnit>
        <FooterSocialMediaIconUnit
          socialMediaLinks={[
            {
              link: 'https://www.linkedin.com/company/dacunnexusacademy/',
              socialMedia: 'linkedin',
            },
          ]}
        />
      </FooterLogoUnit>
      <FooterCopyrightUnit />
    </Footer>
  );
}
