export interface PublicationsResponse {
  items: Publication[];
  count: number;
  total: number;
  limit: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export type StatusType = 'pending' | 'approved' | 'rejected' | 'archived';

export interface PublicationSummary {
  id: string;
  status: StatusType;
  title: string;
  abstract_md?: string;
  document_type: string;
  locations: Location[];
  hdp_tags: string[];
  thematic_tags: string[];
  dac_recommendations: string[];
  affiliations: string[];
  authors: string;
  publication_year: number;
  languages: { code: string; name: string }[];
  external_url: string;
  rating: number;
}

export interface Publication extends PublicationSummary {
  unmapped_locations: Location[];
  banner_asset_id: string;
  primary_document_asset_ids: string[];
  assets: PublicationAsset[];
  created_at: string;
  updated_at: string;
  approved_at: string;
}

export interface PublicationAsset {
  id: string;
  role: 'banner' | 'primary_document' | 'attachment';
  position: number;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  url: string;
  scan_status: string;
}

export interface Taxonomies {
  document_types: string[];
  thematic_tags: string[];
  hdp_tags: string[];
  dac_recommendations: string[];
  languages: { code: string; name: string }[];
}

export interface Locations {
  m49_code: string;
  name: string;
  type: string;
  iso_alpha2: string;
  iso_alpha3: string;
  parent_m49_code: string;
}
export interface Location {
  m49_code: string;
  name: string;
  type: string;
  iso_alpha2: string;
  iso_alpha3: string;
  parent_m49_code: string;
}
