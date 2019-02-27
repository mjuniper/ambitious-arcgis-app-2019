'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'ambitious-arcgis-app-2019',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    torii: {
      sessionServiceName: 'session',
      providers: {
       'arcgis-oauth-bearer': {
          apiKey: 'qVKIgDFn8LEUvfWH',
          portalUrl: 'https://www.arcgis.com'
        }
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      map: {
        options: {
          basemap: 'gray'
        },
        itemExtents: {
          symbol: {
            color: [51, 122, 183, 0.125],
            outline: {
              color: [51, 122, 183, 1],
              width: 1,
              type: 'simple-line',
              style: 'solid'
            },
            type: 'simple-fill',
            style: 'solid'
          },
          popupTemplate: {
            title: '{title}',
            content: '{snippet}'
          }
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
