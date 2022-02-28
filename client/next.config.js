/**
 * * Middleware function to check the changes every 300
 */
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
