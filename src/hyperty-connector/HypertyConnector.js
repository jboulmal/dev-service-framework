/* jshint undef: true */

import HypertyDiscovery from '../hyperty-discovery/HypertyDiscovery';
import ConnectionController from './ConnectionController';
import EventEmitter from '../utils/EventEmitter';
import Syncher from '../syncher/Syncher';
import {divideURL} from '../utils/utils';

/**
* Hyperty Connector;
* @author Vitor Silva [vitor-t-silva@telecom.pt]
* @version 0.1.0
*/
class HypertyConnector extends EventEmitter {

  /**
  * Create a new Hyperty Connector
  * @param  {Syncher} syncher - Syncher provided from the runtime core
  */
  constructor(hypertyURL, bus, configuration) {

    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    super(hypertyURL, bus, configuration);

    let _this = this;
    _this._hypertyURL = hypertyURL;
    _this._bus = bus;
    _this._configuration = configuration;
    _this._domain = divideURL(hypertyURL).domain;

    _this._objectDescURL = 'hyperty-catalogue://' + _this._domain + '/.well-known/dataschemas/FakeDataSchema';

    _this._controllers = {};

    _this.hypertyDiscovery = new HypertyDiscovery(_this._domain, bus);

    let syncher = new Syncher(hypertyURL, bus, configuration);
    syncher.onNotification(function(event) {
      _this._onNotification(event);
    });

    _this._syncher = syncher;
  }

  _onNotification(event) {

    let _this = this;

    console.info('------------ Acknowledges the Reporter ------------ \n');
    event.ack();
    console.info('------------------------ END ---------------------- \n');

    if (_this._controllers[event.from]) {
      _this._autoSubscribe(event);
    } else {
      _this._autoAccept(event);
    }

  }

  _autoSubscribe(event) {
    let _this = this;
    let syncher = _this._syncher;

    console.info('---------------- Syncher Subscribe ---------------- \n');
    console.info('Subscribe URL Object ', event, syncher);
    syncher.subscribe(_this._objectDescURL, event.url).then(function(dataObjectObserver) {
      console.info('1. Return Subscribe Data Object Observer', dataObjectObserver);
      console.log(_this._controllers);
      _this._controllers[event.from].dataObjectObserver = dataObjectObserver;

    }).catch(function(reason) {
      console.error(reason);
    });
  }

  _autoAccept(event) {
    let _this = this;
    let syncher = _this._syncher;

    console.info('---------------- Syncher Subscribe ---------------- \n');
    console.info('Subscribe URL Object ', event, syncher);
    syncher.subscribe(_this._objectDescURL, event.url).then(function(dataObjectObserver) {
      console.info('1. Return Subscribe Data Object Observer', dataObjectObserver);

      let connectionController = new ConnectionController(syncher, _this._domain, _this._configuration);
      connectionController.remotePeerInformation = event;
      connectionController.dataObjectObserver = dataObjectObserver;

      _this.trigger('connector:connected', connectionController);
      _this.trigger('have:notification', event);

      console.info('------------------------ END ---------------------- \n');
    }).catch(function(reason) {
      console.error(reason);
    });
  }

  /**
  * Establish connection with other client identifier
  * @param  {HypertyURL} HypertyURL - Define the identifier of the other component
  * @param  {Object} options - Object with options to improve the connect
  */
  connect(hypertyURL, stream) {
    // TODO: Pass argument options as a stream, because is specific of implementation;
    // TODO: CHange the hypertyURL for a list of URLS
    let _this = this;
    let syncher = _this._syncher;

    return new Promise(function(resolve, reject) {

      let connectionController;
      console.info('------------------------ Syncher Create ---------------------- \n');
      syncher.create(_this._objectDescURL, [hypertyURL], {})
      .then(function(dataObjectReporter) {
        console.info('1. Return Create Data Object Reporter', dataObjectReporter);

        connectionController = new ConnectionController(syncher, _this._domain, _this._configuration);
        connectionController.stream = stream;
        connectionController.dataObjectReporter = dataObjectReporter;

        _this._controllers[hypertyURL] = connectionController;

        resolve(connectionController);
        console.info('--------------------------- END --------------------------- \n');
      })
      .catch(function(reason) {
        console.error(reason);
        reject(reason);
      });

    });
  }

}

export default function activate(hypertyURL, bus, configuration) {

  return {
    name: 'HypertyConnector',
    instance: new HypertyConnector(hypertyURL, bus, configuration)
  };

}
