import Ember from 'ember';

export default class RouteParams {
  constructor(router, params) {
    this._router = router;
    this._params = params;
    this._transitionTo = undefined;
    this._replaceWith = undefined;

    /*
      We need to opt out of Ember eagerly pulling on the getters defined in this class. This is due to
      watchKeys (https://github.com/emberjs/ember.js/blob/d8880eed573a56c8a9172ef9d2bebcfe8fd25582/packages/ember-metal/lib/watch_key.js#L24)
      getting a property to check for reference counting. Without this, our intentionally lazy getter is evaluated twice
      in a single render.
    */
    let m = Ember.meta(this);
    m.writeWatching('isActive', 1);
    m.writeWatching('url', 1);
    m.writeWatching('transitionTo', 1);
    m.writeWatching('replaceWith', 1);
  }

  get isActive() {
    return this._router.isActive(...this._params);
  }

  get url() {
    return this._router.urlFor(...this._params);
  }

  get transitionTo() {
    if (this._transitionTo === undefined) {
      this._transitionTo = () => {
        return this._router.transitionTo(...this._params);
      };
    }

    return this._transitionTo;
  }

  get replaceWith() {
    if (this._replaceWith === undefined) {
      this._replaceWith = () => {
        return this._router.replaceWith(...this._params);
      };
    }

    return this._replaceWith;
  }
}
