"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_utils=require("../utils/utils"),_CatalogueDataObjectFactory=require("../catalogue-factory/CatalogueDataObjectFactory"),_CatalogueDataObjectFactory2=_interopRequireDefault(_CatalogueDataObjectFactory),_PersistenceManager=require("../persistence/PersistenceManager"),_PersistenceManager2=_interopRequireDefault(_PersistenceManager),RuntimeCatalogue=function(){function e(t){if(_classCallCheck(this,e),!t)throw Error("The catalogue needs the runtimeFactory");var a=this;a._factory=new _CatalogueDataObjectFactory2["default"]((!1),(void 0)),a.httpRequest=t.createHttpRequest(),a.atob=t.atob?t.atob:atob}return _createClass(e,[{key:"getDescriptor",value:function(e,t){var a=this;return new Promise(function(r,c){a.httpRequest.get(e+"/version").then(function(o){_PersistenceManager2["default"].getVersion(e)>=o?r(t(a,_PersistenceManager2["default"].get(e))):a.httpRequest.get(e).then(function(o){if(o=JSON.parse(o),o.ERROR)c(o);else{for(var n in o)try{o[n]=JSON.parse(o[n])}catch(i){}var u=t(a,o);_PersistenceManager2["default"].set(e,u.version,o),r(u)}})})["catch"](function(e){c(e)})})}},{key:"getHypertyDescriptor",value:function(e){var t=this;return t.getDescriptor(e,t._createHyperty)}},{key:"getStubDescriptor",value:function(e){var t=this,a=(0,_utils.divideURL)(e),r=a.type,c=a.domain,o=a.identity;o=o?o.substring(o.lastIndexOf("/")+1):"default";var n="catalogue.";return e.includes("catalogue")&&(n=""),e=r+"://"+n+c+"/.well-known/protocolstub/"+o,t.getDescriptor(e,t._createStub)}},{key:"getRuntimeDescriptor",value:function(e){var t=this;return t.getDescriptor(e,t._createRuntimeDescriptor)}},{key:"getDataSchemaDescriptor",value:function(e){var t=this;return t.getDescriptor(e,t._createDataSchema)}},{key:"getIdpProxyDescriptor",value:function(e){var t=this;return new Promise(function(a,r){var c=(0,_utils.divideURL)(e),o=c.type,n=c.domain,i=c.identity,u=(0,_utils.divideURL)(t.runtimeURL),s=u.domain;n||(n=e),i=n!==s&&i?i.substring(i.lastIndexOf("/")+1):"default";var g="catalogue.";return e.includes("catalogue")&&(g=""),e=o+"://"+n+"/.well-known/idp-proxy/"+i,t.getDescriptor(e,t._createIdpProxy).then(function(e){a(e)})["catch"](function(){return i=n,n=s,e=o+"://"+g+n+"/.well-known/idp-proxy/"+i,t.getDescriptor(e,t._createIdpProxy)}).then(function(e){a(e)})["catch"](function(e){r(e)})})}},{key:"_createHyperty",value:function(e,t){var a=e._factory.createHypertyDescriptorObject(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL,t.type||t.hypertyType,t.dataObjects);a.configuration=t.configuration,a.constraints=t.constraints,a.messageSchema=t.messageSchema,a.policies=t.policies,a.signature=t.signature;var r=t.sourcePackage;return r&&(a.sourcePackage=e._createSourcePackage(e,r)),a}},{key:"_createStub",value:function(e,t){var a=e._factory.createProtoStubDescriptorObject(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL,t.messageSchemas,t.configuration,t.constraints);a.signature=t.signature;var r=t.sourcePackage;return r&&(r=e._createSourcePackage(e,r),a.sourcePackage=r),a}},{key:"_createRuntimeDescriptor",value:function(e,t){try{t.hypertyCapabilities=JSON.parse(t.hypertyCapabilities),t.protocolCapabilities=JSON.parse(t.protocolCapabilities)}catch(a){}var r=e._factory.createHypertyRuntimeDescriptorObject(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL,t.type||t.runtimeType,t.hypertyCapabilities,t.protocolCapabilities);r.signature=t.signature;var c=t.sourcePackage;return c&&(r.sourcePackage=e._createSourcePackage(e,c)),r}},{key:"_createDataSchema",value:function(e,t){var a=void 0;a=t.accessControlPolicy&&t.scheme?e._factory.createHypertyDataObjectSchema(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL,t.accessControlPolicy,t.scheme):e._factory.createMessageDataObjectSchema(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL),a.signature=t.signature;var r=t.sourcePackage;if(r){a.sourcePackage=e._createSourcePackage(e,r);try{a.sourcePackage.sourceCode=JSON.parse(a.sourcePackage.sourceCode)}catch(c){}return a}return new Promise(function(r,c){e.getSourcePackageFromURL(t.sourcePackageURL).then(function(e){a.sourcePackage=e,r(a)})["catch"](function(e){c(e)})})}},{key:"_createIdpProxy",value:function(e,t){var a=e._factory.createProtoStubDescriptorObject(t.cguid,t.version,t.objectName,t.description,t.language,t.sourcePackageURL,t.messageSchemas,t.configuration,t.constraints);a.signature=t.signature;var r=t.sourcePackage;return r&&(r=e._createSourcePackage(e,r),a.sourcePackage=r),a}},{key:"_createSourcePackage",value:function(e,t){try{t=JSON.parse(t)}catch(a){}"base64"===t.encoding&&(t.sourceCode=e.atob(t.sourceCode),t.encoding="UTF-8");var r=e._factory.createSourcePackage(t.sourceCodeClassname,t.sourceCode);return t.encoding&&(r.encoding=t.encoding),t.signature&&(r.signature=t.signature),r}},{key:"getSourcePackageFromURL",value:function(e){var t=this;return console.warn("-------------------------------------------------------------------------------------------"),console.warn("ATTENTION: This function may fail if the sourceCode of the the sourcePackage is very large!"),console.warn("-------------------------------------------------------------------------------------------"),new Promise(function(a,r){t.httpRequest.get(e).then(function(e){if(e.ERROR)r(e);else{e=JSON.parse(e);var c=t._createSourcePackage(t,e);a(c)}})["catch"](function(e){r(e)})})}},{key:"getSourceCodeFromDescriptor",value:function(e){var t=this;return new Promise(function(a,r){e.sourcePackage?a(e.sourcePackage.sourceCode):_PersistenceManager2["default"].getVersion(e.sourcePackageURL+"/sourceCode")>=e.version?a(_PersistenceManager2["default"].get(e.sourcePackageURL+"/sourceCode")):t.httpRequest.get(e.sourcePackageURL+"/sourceCode").then(function(t){t.ERROR?r(t):(_PersistenceManager2["default"].set(e.sourcePackageURL+"/sourceCode",e.version,t),a(t))})})}},{key:"deleteFromPM",value:function(e){_PersistenceManager2["default"]["delete"](e)}},{key:"runtimeURL",set:function(e){var t=this;t._runtimeURL=e},get:function(){var e=this;return e._runtimeURL}}]),e}();exports["default"]=RuntimeCatalogue,module.exports=exports["default"];
//# sourceMappingURL=RuntimeCatalogue.js.map
