/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

import HypertyDiscovery from '../hyperty-discovery/HypertyDiscovery';
import EventEmitter from '../utils/EventEmitter';
import communication from './communication';
import {divideURL} from '../utils/utils';
import Syncher from '../syncher/Syncher';
import participant from './participant';
import ChatGroup from './Chat';

/**
* Hyperty Chat;
* @author Vitor Silva [vitor-t-silva@telecom.pt]
* @version 0.1.0
*/
class HypertyChat extends EventEmitter {

  constructor(hypertyURL, bus, configuration) {
    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    super(hypertyURL, bus, configuration);

    let _this = this;
    let syncher = new Syncher(hypertyURL, bus, configuration);

    let domain = divideURL(hypertyURL).domain;
    let hypertyDiscovery = new HypertyDiscovery(hypertyURL, bus);

    _this._objectDescURL = 'hyperty-catalogue://' + domain + '/.well-known/dataschemas/FakeDataSchema';

    _this._hypertyURL = hypertyURL;
    _this._syncher = syncher;
    _this._hypertyDiscovery = hypertyDiscovery;

    syncher.onNotification(function(event) {
      console.log('Notification: ', event);
      _this._autoSubscribe(event.url);
    });

  }

  _autoSubscribe(resource) {
    let _this = this;

    _this.join(resource).then(function(chatGroup) {
      _this.trigger('chat:subscribe', chatGroup);
    }).catch(function(reason) {
      console.error(reason);
    });

  }

  /**
   * This function is used to create a new Group Chat providing the identifier of the Group to be notified.
   * @param  {String} name             chat name
   * @param  {URL.UserURL} UserURLList List of User allowed
   * @return {Promise}
   */
  create(name, participants) {

    let _this = this;
    let syncher = _this._syncher;
    let hypertyDiscovery = _this._hypertyDiscovery;

    return new Promise(function(resolve, reject) {

      // Create owner participant
      // TODO: create all information to communication;
      communication.owner = _this._hypertyURL;
      communication.id = name;

      // Set the other subscription like a participant
      participant.hypertyResource = _this._hypertyURL;
      communication.participants.push(participant);

      console.info('----------------------- Mapping Particpants -------------------- \n');
      _this._mappingUser(participants).then(function(hyperties) {
        console.info(`Have ${hyperties.length} participants;`);

        console.info('------------------------ Syncher Create ---------------------- \n');
        return syncher.create(_this._objectDescURL, hyperties, {communication: communication});
      })
      .then(function(dataObjectReporter) {
        console.info('3. Return Create Data Object Reporter', dataObjectReporter);

        let chat = new ChatGroup(syncher, hypertyDiscovery, _this._domain);
        resolve(chat);

        chat.dataObjectReporter = dataObjectReporter;

      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

  join(resource) {
    let _this = this;
    let syncher = _this._syncher;

    return new Promise(function(resolve, reject) {

      console.info('------------------------ Syncher subscribe ---------------------- \n');
      console.info(resource);

      syncher.subscribe(_this._objectDescURL, resource).then(function(dataObjectObserver) {
        console.info('Data Object Observer: ', dataObjectObserver);
        let chat = new ChatGroup(syncher, _this._hypertyDiscovery, _this._domain);
        chat.dataObjectObserver = dataObjectObserver;

        resolve(chat);
      }).catch(function(reason) {
        reject(reason);
      });
    });

  }

  _mappingUser(userList) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let hyperties = [];
      let count = 0;

      let resultUsers = function() {
        if (count === userList.length) {
          console.info('Have ' + hyperties.length + 'users found;');
          resolve(hyperties);
        }
      };

      let activeUsers = function(user) {
        count++;
        hyperties.push(user.hypertyURL);
        resultUsers();
      };

      let inactiveUsers = function() {
        count++;
        resultUsers();
      };

      userList.forEach(function(user) {
        console.log(user);
        if (user.email.length) {
          return _this._hypertyDiscovery.discoverHypertyPerUser(user.email, user.domain).then(activeUsers).catch(inactiveUsers);
        }
      });

    });

  }

}

export default function activate(hypertyURL, bus, configuration) {

  return {
    name: 'HypertyChat',
    instance: new HypertyChat(hypertyURL, bus, configuration)
  };

}
