const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { i18n } = require('./next-i18next.config');
module.exports = withPWA({
  reactStrictMode: true,
  i18n,
  pwa: {
    disable: process.env.NODE_ENV !== 'production',
    dest: 'public',
    runtimeCaching,
  },
  images: {
    domains: [
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'theproart.s3.ap-south-1.amazonaws.com',
      'theproart.s3.amazonaws.com',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      '18.141.64.26',
      'i.ibb.co',
      '127.0.0.1',
      'localhost',
      'picsum.photos',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
  },
  ...(process.env.FRAMEWORK_PROVIDER === 'graphql' && {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
      });

      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      });

      return config;
    },
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
});
