// jshint browser:true, jquery: true
import {addLoader, removeLoader, documentReady, errorMessage} from './support';

// polyfills
import 'babel-polyfill';
import 'indexeddbshim';
import 'mutationobserver-shim';
import 'object.observe';
import 'array.observe';

// reTHINK modules
import RuntimeUA from 'runtime-core/dist/runtimeUA';

import SandboxFactory from '../resources/sandboxes/SandboxFactory';
let sandboxFactory = new SandboxFactory();
let avatar = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
let runtime = new RuntimeUA(sandboxFactory);

window.runtime = runtime;

// Check if the document is ready
if (document.readyState === 'complete') {
  documentReady();
} else {
  window.addEventListener('onload', documentReady, false);
  document.addEventListener('DOMContentLoaded', documentReady, false);
}

let loginBtn = document.querySelector('.login');
loginBtn.addEventListener('click', function(e) {

  let loginPanel = document.querySelector('.login-panel');
  let content = loginPanel.querySelector('.card-action');
  addLoader(content);

  runtime.identityModule.loginWithRP().then(function(result) {
    removeLoader(content);
    userLoged(result);
  }).catch(function(reason) {
    removeLoader(content);
    let cardHolder = $('.card-content');
    let html = '<div class="row"><div class="col s12"><span class="card-title">Login</span></div><div class="col s12">' + reason.error.message + '</div>';

    cardHolder.html(html);
  });

  let btn = $(e.currentTarget);
  btn.addClass('hide');

});

function userLoged(result) {

  let hypertyHolder = $('.hyperties');
  hypertyHolder.removeClass('hide');

  let cardHolder = $('.card-content');
  let html = '<div class="row"><div class="col s12"><span class="card-title">Logged</span></div><div class="col s2"><img alt="" class="circle responsive-img" src=' + result.picture + ' ></div><div class="col s8"><p><b>id:</b> ' + result.id + '</p><p><b>email:</b> ' + result.email + '</p><p><b>name:</b> ' + result.name + '</p><p><b>locale:</b> ' + result.locale + '</p></div>';

  cardHolder.html(html);

  console.log(result);

  let hyperty = 'http://ua.pt/HelloHyperty';

  // Load First Hyperty
  runtime.loadHyperty(hyperty).then(hypertyDeployed).catch(function(reason) {
    errorMessage(reason);
  });

}

function hypertyDeployed(result) {

  let loginPanel = $('.login-panel');
  let cardAction = loginPanel.find('.card-action');
  let hypertyInfo = '<span class="white-text"><p><b>hypertyURL:</b> ' + result.runtimeHypertyURL + '</br><b>status:</b> ' + result.status + '</p></span>';

  loginPanel.attr('data-url', result.runtimeHypertyURL);
  cardAction.append(hypertyInfo);

  // Prepare to discover email:
  discoverEmail();

  // Prepare the chat
  let messageChat = $('.hyperty-chat');
  messageChat.removeClass('hide');

  let connector = window.components[result.runtimeHypertyURL].hypertyCode.hypertyConnector;

  connector.addEventListener('connector:notification', notificationHandler);

  connector.connectionController.addEventListener('stream:added', processVideo);

  runtime.messageBus.addListener(result.runtimeHypertyURL, newMessageRecived);
}

function discoverEmail() {

  let section = $('.discover');
  let searchForm = section.find('.form');
  let inputField = searchForm.find('.friend-email');

  section.removeClass('hide');

  searchForm.on('submit', function(event) {
    event.preventDefault();

    let collection = section.find('.collection');
    let collectionItem = '<li class="collection-item"><div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></li>';

    collection.removeClass('hide');
    collection.addClass('center-align');
    collection.html(collectionItem);

    let email = inputField.val();
    console.log(email);
    runtime.registry.getUserHyperty(email).then(emailDiscovered).catch(emailDiscoveredError);

  });
}

function emailDiscovered(result) {
  // Email Discovered:  Object {id: "openidtest10@gmail.com", descriptor: "http://ua.pt/HelloHyperty", hypertyURL: "hyperty://ua.pt/27d080c8-22ef-445f-9f9a-f2c750fc6d5a"}

  console.log('Email Discovered: ', result);

  let section = $('.discover');
  let collection = section.find('.collection');
  let collectionItem = '<li class="collection-item avatar"><img src="' + avatar + '" alt="" class="circle"><span class="title">' + result.id + '</span><p>' + result.descriptor + '<br>' + result.hypertyURL + '</p><a href="#!" class="message-btn"><i class="material-icons left">message</i>Send Message</a><a href="#!" class="call-btn"><i class="material-icons">call</i>Call</a></li>';

  collection.empty();
  collection.removeClass('center-align');
  collection.append(collectionItem);

  let messageChatBtn = collection.find('.message-btn');
  messageChatBtn.on('click', function(event) {
    event.preventDefault();
    openChat(result, false);
  });

  let callBtn = collection.find('.call-btn');
  callBtn.on('click', function(event) {
    event.preventDefault();
    openChat(result, true);
  });

}

function emailDiscoveredError(result) {

  // result = {
  //   id: 'openidtest10@gmail.com',
  //   descriptor: 'http://ua.pt/HelloHyperty',
  //   hypertyURL: 'hyperty://ua.pt/27d080c8-22ef-445f-9f9a-f2c750fc6d5a'
  // };
  //
  // emailDiscovered(result);

  console.error('Email Discovered Error: ', result);

  let section = $('.discover');
  let collection = section.find('.collection');

  let collectionItem = '<li class="collection-item orange lighten-3"><i class="material-icons left circle">error_outline</i>' + result + '</li>';

  collection.empty();
  collection.removeClass('center-align');
  collection.removeClass('hide');
  collection.append(collectionItem);
}

function openChat(result, video) {

  let messagesChat = $('.messages');
  let messageForm = messagesChat.find('.form');
  let loginPanel = $('.login-panel');
  let fromUser = loginPanel.attr('data-url');
  let toUserEl = messagesChat.find('.runtime-hyperty-url');
  let toUser = result.hypertyURL;

  toUserEl.html(toUser);

  if (video) {

    let a = window.components[fromUser].hypertyCode;

    console.log(toUser);

    a.connect(toUser).then(function(controller) {

      controller.addEventListener('stream:added', processVideo);

    }).catch(function(reason) {
      console.error(reason);
    });

  }

  messageForm.on('submit', function(e) {

    let messageText = messagesChat.find('.message-text').val();

    if (messageText) {
      sendMessage(fromUser, toUser, messageText);
    }

    messageForm[0].reset();

    e.preventDefault();
  });

  messagesChat.removeClass('hide');

}

function newMessageRecived(msg) {

  console.log(msg);

  // Object {to: "hyperty://ua.pt/71552726-ae61-411a-bab0-41843b26b56f", from: "hyperty://ua.pt/586f5f0a-aa98-4d23-b864-a6efd3ccdd74", type: "message", body: Object, id: 2}
  processMessage(msg, 'in');

}

function processVideo(stream) {

  let messageChat = $('.hyperty-chat');
  let video = messageChat.find('.video');

  video.removeClass('hide');
  video[0].src = stream;
}

function processMessage(msg, type) {

  console.log(type);

  if (typeof msg.body.value !== 'object') {

    let messageCollection = $('.hyperty-chat .collection');
    let messageItem = '<li class="collection-item avatar"><img src="' + avatar + '" alt="" class="circle"><span class="title">' + msg.from + '</span><p>' + msg.body.value.replace(/\n/g, '<br>') + '</p></li>';

    messageCollection.append(messageItem);
  }

}

function sendMessage(from, to, message) {

  let msg = {
    to: to,
    from: from,
    type: 'message',
    body:{
      value: message
    }
  };

  processMessage(msg, 'out');
  runtime.messageBus.postMessage(msg);
}

function notificationHandler(event) {

  let loginPanel = $('.login-panel');
  let hypertyId = loginPanel.attr('data-url');
  let incoming = $('.modal-call');
  let informationHolder = incoming.find('.information');
  let agreeBtn = incoming.find('.modal-action');

  let parseInformation = '<label>From: </label>' + event.from;

  parseInformation += '<h5>Resources</h5><ul>';
  Object.keys(event.resources).map(function(key) {
    parseInformation += '<li>' + key + '</li>';
  });

  parseInformation += '</ul>';

  informationHolder.html(parseInformation);

  console.log(event);

  agreeBtn.on('click', function(e) {

    let a = window.components[hypertyId].hypertyCode;
    a.accept().then(function(controller) {
      console.log('Controller: ', controller);
    }).catch(function(reason) {
      console.error(reason);
    });

    e.preventDefault();
  });

  $('.modal-call').openModal();

}