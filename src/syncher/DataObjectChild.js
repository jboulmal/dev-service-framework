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

import SyncObject from './SyncObject';

/**
 * The class returned from the DataObject addChildren call or from onAddChildren if remotely created.
 * Children object synchronization is a a fast forward mechanism, no need for direct subscriptions, it uses the already authorized subscription from the parent DataObject.
 */
class DataObjectChild /* implements SyncStatus */ {
  /* private

  ----event handlers----
  _onResponseHandler: (event) => void
  */

  /**
   * @ignore
   * Should not be used directly by Hyperties. It's called by the DataObject.addChildren
   */
  constructor(owner, childId, msgId, bus, initialData) {
    let _this = this;

    _this._owner = owner;
    _this._childId = childId;
    _this._bus = bus;
    _this._syncObj = new SyncObject(initialData);

    bus.addListener(owner, (msg) => {
      if (msg.type === 'response' && msg.id === msgId) {
        console.log('DataObjectChild.onResponse:', msg);
        _this._onResponse(msg);
      }
    });

  }

  /**
   * Children ID generated on addChildren. Unique identifier
   * @type {URL} - URL of the format <HypertyURL>#<numeric-sequence>
   */
  get childId() { return this._childId; }

  /**
   * Data Structure to be synchronized.
   * @type {JSON} - JSON structure that should follow the defined schema, if any.
   */
  get data() { return this._syncObj.data; }

  /**
   * Register the change listeners sent by the reporter child
   * @param {function(event: MsgEvent)} callback
   */
  onChange(callback) {
    this._syncObj.observe((event) => {
      callback(event);
    });
  }

  /**
   * Setup the callback to process response notifications of the creates
   * @param {function(event: MsgEvent)} callback
   */
  onResponse(callback) {
    this._onResponseHandler = callback;
  }

  _onResponse(msg) {
    let _this = this;

    let event = {
      type: msg.type,
      url: msg.body.source,
      code: msg.body.code
    };

    if (_this._onResponseHandler) {
      _this._onResponseHandler(event);
    }
  }

}

export default DataObjectChild;