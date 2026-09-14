export interface DocumentDataType {
  Title: string;
  Abstract: string;
  'Document Type': string;
  'Region / Country': string;
  'HDP Tags': string;
  'Thematic Tags': string;
  'DAC Recommendation': string;
  Affiliations: string;
  Authors: string;
  'Publication Year': number;
  Language: string;
  Link: string;
  Rating: number | null;
  Banner: string;
  PDF: string;
}
export interface DocumentFormattedDataType {
  id: string;
  Title: string;
  Abstract: string;
  'Document Type': string;
  'Region / Country': string[];
  'HDP Tags': string[];
  'Thematic Tags': string;
  'DAC Recommendation': string[];
  Affiliations: string;
  Authors: string;
  'Publication Year': number;
  Language: string[];
  Link: string;
  Rating: number | null;
  Banner: string;
  PDF: string;
}
