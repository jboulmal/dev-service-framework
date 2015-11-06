import SyncSubscription from './SyncSubscription';
import SyncObject from './SyncObject';
import {deepClone} from './SyncObject';

class DataObjectReporter /* implements SyncStatus */ {
  /* private
  _version: number

  _url: ObjectURL
  _schema: Schema
  _bus: MiniBus
  _status: on | paused

  _syncObj: SyncData
  _subscriptions: <hypertyUrl: SyncSubscription>

  ----event handlers----
  _onSubscriptionHandlers: [(event) => void]
  */

  constructor(url, schema, bus, initialStatus, initialData) {
    let _this = this;

    _this._version = 0;
    _this._url = url;
    _this._schema = schema;
    _this._bus = bus;

    _this._status = initialStatus;
    _this._syncObj = new SyncObject(initialData);
    _this._syncObj.observe((event) => {
      _this._onChange(event);
    });

    _this._subscriptions = {};
    _this._onSubscriptionHandlers = [];

    bus.addListener(url, (msg) => {
      console.log('DataObjectReporter-RCV: ', msg);
      switch (msg.header.type) {
        case 'subscribe': _this._onSubscribe(msg); break;
        case 'unsubscribe': _this._onUnSubscribe(msg); break;
      }
    });
  }

  get url() { return this._url; }

  get schema() { return this._schema; }

  get status() { return this._status; }

  get data() { return this._syncObj.data; }

  get subscriptions() { return this._subscriptions; }

  pause() {
    Object.keys(_this._subscriptions).forEach((key) => {
      let sub = _this._subscriptions[key];
      sub.pause();
    });
  }

  resume() {
    Object.keys(_this._subscriptions).forEach((key) => {
      let sub = _this._subscriptions[key];
      sub.resume();
    });
  }

  stop() {
    Object.keys(_this._subscriptions).forEach((key) => {
      let sub = _this._subscriptions[key];
      sub.stop();
    });
  }

  /**
   * Invite other Hyperties to listen change events of this reporter.
   * @param  {HypertyURL} url Hyperty to invite.
   * @return {Promise<SyncSubscription>} Return Promise to a new SyncSubscription.
   */
  invite(url) {
    let _this = this;

    let inviteMsg = {
      header: {type: 'invite', from: _this._url, to: url},
      body: {schema: _this._schema, version: _this._version, value: deepClone(_this.data)}
    };

    return new Promise((resolve, reject) => {
      //send invitation
      _this._bus.postMessage(inviteMsg, (reply) => {
        console.log('invite-reply: ', reply);
        if (reply.body.code === 'ok') {
          //invitation accepted
          let newObj = new SyncSubscription(url, 'on');
          _this._subscriptions[url] = newObj;
          resolve(newObj);
        } else {
          //invitation rejected
          reject(reply.body.desc);
        }
      });
    });
  }

  onSubscription(callback) {
    this._onSubscriptionHandlers.push(callback);
  }

  _onSubscribe(msg) {
    let _this = this;

    let hypertyUrl = msg.header.from;

    let event = {
      type: msg.header.type,
      url: hypertyUrl,

      accept: () => {
        //create new subscription
        let newObj = new SyncSubscription(hypertyUrl, 'on');
        _this._subscriptions[hypertyUrl] = newObj;

        //send ok reply message
        let acceptMsg = {
          header: {id: msg.header.id, type: 'reply', from: _this._url, to: hypertyUrl},
          body: {code: 'ok', schema: _this._schema, version: _this._version, value: deepClone(_this.data)}
        };

        _this._bus.postMessage(acceptMsg);
        return newObj;
      },

      reject: (reason) => {
        //send reject reply message
        let rejectMsg = {
          header: {id: msg.header.id, type: 'reply', from: _this._url, to: hypertyUrl},
          body: {code: 'reject', desc: reason}
        };

        _this._bus.postMessage(rejectMsg);
      }
    };

    _this._onSubscriptionHandlers.forEach((handler) => {
      handler(event);
    });
  }

  _onUnSubscribe(msg) {
    let _this = this;

    let hypertyUrl = msg.header.from;
    let sub = _this._subscriptions[hypertyUrl];
    delete _this._subscriptions[hypertyUrl];

    let event = {
      type: msg.header.type,
      url: hypertyUrl,
      object: sub
    };

    _this._onSubscriptionHandlers.forEach((handler) => {
      handler(event);
    });
  }

  //send delta messages to subscriptions
  _onChange(event) {
    let _this = this;

    _this._version++;
    Object.keys(_this._subscriptions).forEach((key) => {
      let sub = _this._subscriptions[key];
      if (sub.status === 'on') {
        //TODO: send version, update version on the SyncSubscription?
        //how to handle unsynchronized versions?
        //will we need confirmation from the receiver?
        let changeMsg = {
          header: {type: 'change', from: _this._url, to: key},
          body: {cType: event.cType, oType: event.oType, attrib: event.field, value: event.data}
        };

        _this._bus.postMessage(changeMsg);
      }
    });
  }
}

export default DataObjectReporter;
