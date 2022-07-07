import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { isServer } from '@vue-storefront/core/helpers';

export const KEY = 'YmQ5YjZlZmEtYTE3Ni00NjUwLWJhNWQtNzQ4Yzk4NDJiZWNi';

const oneSignalStore = {
  namespaced: true,
  state: {
    key: null
  }
};


const oneSignalSnippet = () => (function (w, d) {
  var head = d.getElementsByTagName('head')[0];
  var script = d.createElement('script');
  script.async = true;
  script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
  head.appendChild(script);
  setTimeout(() => {
    var OneSignal = w.OneSignal || [];
    OneSignal.push(() => {
      //oneSignalSettings.appId = '9b2d10a4-328f-4ef8-bc95-7f7c82b2cefe';
      OneSignal.init();
    });
  }, 500);
})(window as any, document);

export const OneSignalModule: StorefrontModule = function ({ store, appConfig }) {
  store.registerModule(KEY, oneSignalStore);
  //if (!isServer && appConfig.oneSignal && appConfig.oneSignal.appId) {

    oneSignalSnippet();
  //}
}
