import Service, { inject as service } from '@ember/service';
import ENV from 'opendata-ui/config/environment';
import encodeJsonapiQuery from 'opendata-ui/utils/search/encode-jsonapi-query';
import fetch from 'fetch';

export default Service.extend({

  appSettings: service(),

  _getUrl (version, params) {
    if (version === 'v2') {
      return this._getV2Url(params);
    } else if (version === 'v3') {
      return this._getV3Url(params);
    }
  },

  _getV2Url: function (params) {
    let url = ENV.APP.API;
    const queryParam = encodeURIComponent(params.q.toLowerCase());
    url += `/datasets/autocomplete.json?query=${queryParam}`;

    const internalUrl = this.get('appSettings.site.data.values.defaultHostname') || this.get('appSettings.site.data.values.internalUrl');
    if (!this.get('appSettings.isUmbrella') && internalUrl) {
      url += `&domain=${internalUrl}`;
    }

    const bbox = this.get('location.bbox');
    if (bbox) {
      const bboxParam = `${bbox.xmin},${bbox.ymin},${bbox.xmax},${bbox.ymax}`;
      url += `&bbox=${bboxParam}`;
    }

    return url;
  },

  _getV3Url: function (params) {
    return ENV.APP.API + `/api/v3/suggest?${encodeJsonapiQuery({ queryObject: params })}`;
  },

  fetch: async function (version, params) {
    // PORTAL-ENV: autocomplete API is not available
    if (this.get('appSettings.isPortal')) return { data: [] };
    const url = this._getUrl(version, params);
    return fetch(url).then((res) => res.json());
  }
});
