const SITE_URL = 'https://nexus.undp.org';
const SITE_NAME = 'Nexus Knowledge Hub';
const DEFAULT_DESC =
  'The go-to library for people working across humanitarian, development and peace.';

interface Arg {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
}

export function metaDataDefinition({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image = `${SITE_URL}/imgs/og-image.png`,
  imageAlt = SITE_NAME,
}: Arg = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title ?? SITE_NAME },
    { property: 'og:description', content: description },
    { property: 'og:url', content: `${SITE_URL}${path}` },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: imageAlt },
    { property: 'og:locale', content: 'en_US' },
  ];
}
