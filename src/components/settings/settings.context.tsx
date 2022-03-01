import React from 'react';
import logoPlaceholder from '@assets/placeholders/logo.svg';
const siteSettings = {
  name: 'TheProArt E-commerce Shop',
  description: '',
  currencyCode: 'INR',
  logo: logoPlaceholder,
};

type State = typeof initialState;

const initialState = {
  siteTitle: siteSettings.name,
  siteSubtitle: siteSettings.description,
  currency: siteSettings.currencyCode,
  logo: {
    id: 1,
    thumbnail: siteSettings.logo,
    original: siteSettings.logo,
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: {
      id: 1,
      thumbnail: '',
      original: '',
    },
    twitterHandle: '',
    twitterCardType: '',
    metaTags: '',
    canonicalUrl: '',
  },
  google: {
    isEnable: false,
    tagManagerId: '',
  },
  facebook: {
    isEnable: false,
    appId: '',
    pageId: '',
  },
  deliveryTime: [
    {
      title: 'Express Delivery',
      description: '90 min express delivery',
    },
    {
      title: 'Morning',
      description: '8.00 AM - 11.00 AM',
    },
    {
      title: 'Noon',
      description: '11.00 AM - 2.00 PM',
    },
    {
      title: 'Afternoon',
      description: '2.00 PM - 5.00 PM',
    },
    {
      title: 'Evening',
      description: '5.00 PM - 8.00 PM',
    },
  ],
  contactDetails: {
    socials: [],
    contact: '',
  },
};

export const SettingsContext = React.createContext<State | any>(initialState);

SettingsContext.displayName = 'SettingsContext';

export const SettingsProvider: React.FC<{ initialValue: any }> = ({
  initialValue,
  ...props
}) => {
  const [state] = React.useState(initialValue ?? initialState);
  return <SettingsContext.Provider value={state} {...props} />;
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(`useSettings must be used within a SettingsProvider`);
  }
  return context;
};
