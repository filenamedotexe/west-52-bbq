import { BUSINESS } from 'astrowind:config';
import type { BusinessConfig } from '~/vendor/integration/utils/configBuilder';

export type BusinessInfo = BusinessConfig;

export const getBusinessInfo = (): BusinessInfo => {
  return BUSINESS;
};

export const getGoogleMapsEmbedUrl = (): string => {
  const business = getBusinessInfo();
  const address = encodeURIComponent(business.address.full);
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=${address}`;
};

export const getGoogleMapsDirectionsUrl = (): string => {
  const business = getBusinessInfo();
  const address = encodeURIComponent(business.address.full);
  return `https://www.google.com/maps/dir//${address}`;
};

export const getGoogleMapsSearchUrl = (): string => {
  const business = getBusinessInfo();
  const query = encodeURIComponent(`${business.name} ${business.address.full}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};
