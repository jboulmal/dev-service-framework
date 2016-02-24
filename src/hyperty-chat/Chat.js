import EventEmitter from '../utils/EventEmitter';
import participant from './participant';

class ChatGroup extends EventEmitter {

  constructor(syncher, hypertyDiscovery, domain) {

    if (!syncher) throw Error('Syncher is a necessary dependecy');
    if (!hypertyDiscovery) throw Error('Hyperty discover is a necessary dependecy');

    super(syncher, hypertyDiscovery);

    let _this = this;
    _this._syncher = syncher;
    _this._hypertyDiscovery = hypertyDiscovery;

    _this._objectDescURL = 'hyperty-catalogue://' + domain + '/.well-known/dataschemas/FakeDataSchema';
  }

  set dataObjectReporter(dataObjectReporter) {

    if (!dataObjectReporter) throw new Error('The data object reporter is necessary parameter');

    let _this = this;
    _this._dataObjectReporter = dataObjectReporter;

    console.info('Set data object reporter: ', dataObjectReporter);

    dataObjectReporter.onSubscription(function(event) {

      event.accept();

      // Set the other subscription like a participant
      participant.hypertyResource = event.url;
      dataObjectReporter.data.communication.participants.push(participant);

      _this.trigger('participant:added', participant);
    });

    dataObjectReporter.onAddChildren(function(children){
      _this._processChildren(children);
    });

  }

  get dataObjectReporter() {
    let _this = this;
    return _this._dataObjectReporter;
  }

  set dataObjectObserver(dataObjectObserver) {
    let _this = this;

    _this._dataObjectObserver = dataObjectObserver;

    _this.processPartipants(dataObjectObserver);

    dataObjectObserver.onChange('*', function(event) {
      console.info('Change Event: ', event);
      _this.processPartipants(dataObjectObserver);
    });

    dataObjectObserver.onAddChildren(function(children){
      _this._processChildren(children);
    });

  }

  get dataObjectObserver() {
    let _this = this;
    return _this._dataObjectObserver;
  }

  get dataObject() {
    let _this = this;
    return _this._dataObjectReporter ? _this.dataObjectReporter : _this.dataObjectObserver;
  }

  processPartipants(dataObject) {
    let _this = this;
    let participants = dataObject.data.communication.participants;

    console.log('Process Participants: ', participants);

    participants.forEach(function(participant) {
      if (dataObject._owner !== participant.hypertyResource){
        console.log('Each Participant will be trigger: ', participant);
        _this.trigger('participant:added', participant);
      }
    });

  }

  /**
   * Process children messages
   * @param  {[type]} children [description]
   * @return {[type]}          [description]
   */
  _processChildren(children) {
    let _this = this;

    console.info('Process Message:', children);

    _this.trigger('new:message:recived', children);
  }

  /**
   * This function is used to send a chat message.
   * @param  {Message} message text to be send
   */
  send(message) {
    console.log(message, this);
    let _this = this;
    let dataObject = _this.dataObjectReporter ? _this.dataObjectReporter : _this.dataObjectObserver;

    return new Promise(function(resolve, reject) {

      dataObject.addChildren('message', {chatMessage: message}).then(function(dataObjectChild) {
        console.info(dataObjectChild);
        let msg = {
          childId: dataObjectChild._childId,
          from: dataObjectChild._owner,
          value: dataObjectChild.data
        };

        _this._processChildren(msg);
        resolve(dataObjectChild);
      }).catch(function(reason) {
        console.error('Reason:', reason);
        reject(reason);
      });
    });

  }

  /**
   * This function is used to close an existing Group Chat instance.
   *
   */
  close() {

  }

  join(resource) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      _this.addParticipant(resource).then(function(result) {
        resolve('joined: ', result);
      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

  // TODO: improve this with an invite;
  /**
   * This function is used to add / invite new participant on an existing Group Chat instance.
   * @return {Promise} Promise with the status
   */
  addParticipant(email) {

    let _this = this;
    let syncher = _this._syncher;

    return new Promise(function(resolve, reject) {


    });

  }

  /**
   * This function is used to remove a participant from an existing Group Chat instance.
   * @return {Promise} Promise with the status
   */
  removeParticipant() {
    return new Promise(function(resolve, reject) {

      try {
        resolve('participant removed');
      } catch (e) {
        reject('remove participant fail');
      }

    });

  }

  /**
   * This function is used to open a Group Chat instance that was previously closed.
   * @return {[type]} [description]
   */
  open() {

  }

}

export default ChatGroup;