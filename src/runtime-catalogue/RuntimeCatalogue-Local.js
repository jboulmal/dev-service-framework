import {divideURL} from '../utils/utils';
import CatalogueFactory from '../catalogue-factory/CatalogueDataObjectFactory';

class RuntimeCatalogue {

  constructor(runtimeFactory) {
    // console.log('runtime catalogue');
    if (!runtimeFactory) throw Error('The catalogue needs the runtimeFactory');

    let _this = this;
    _this._factory = new CatalogueFactory(false, undefined);

    _this.httpRequest = runtimeFactory.createHttpRequest();
  }

  set runtimeURL(runtimeURL) {
    let _this = this;
    _this._runtimeURL = runtimeURL;
  }

  get runtimeURL() {
    let _this = this;
    return _this._runtimeURL;
  }

  /**
  * Get hypertyRuntimeURL
  */
  getHypertyRuntimeURL() {
    let _this = this;

    // TODO: check if this is real needed;
    return _this._hypertyRuntimeURL;
  }

  /**
  * Get HypertyDescriptor
  * @param hypertyURL - e.g. mydomain.com/.well-known/hyperty/MyHyperty
  * @returns {Promise}
  */
  getHypertyDescriptor(hypertyURL) {
    let _this = this;

    // console.log("getHypertyDescriptor", hypertyURL);

    return new Promise(function(resolve, reject) {

      let dividedURL = divideURL(hypertyURL);
      let type = dividedURL.type;
      let domain = dividedURL.domain;
      let hyperty = dividedURL.identity;

      if (!domain) {
        domain = hypertyURL;
      }

      if (hyperty) {
        hyperty = hyperty.substring(hyperty.lastIndexOf('/') + 1);
      }

      _this.httpRequest.get(type + '://' + domain + '/resources/descriptors/Hyperties.json').then(function(descriptor) {
        _this.Hyperties = JSON.parse(descriptor);

        let result = _this.Hyperties[hyperty];

        if (result.error) {
          // TODO handle error properly
          reject(result);
        } else {
          // console.log("creating hyperty descriptor based on: ", result);

          // create the descriptor
          let hyperty = _this._factory.createHypertyDescriptorObject(
            result.cguid,
            result.version,
            result.objectName,
            result.description,
            result.language,
            result.sourcePackageURL,
            result.type,
            result.dataObjects
          );

          // optional fields
          hyperty.configuration = result.configuration;
          hyperty.constraints = result.constraints;
          hyperty.messageSchema = result.messageSchema;
          hyperty.policies = result.policies;
          hyperty.signature = result.signature;

          // parse and attach sourcePackage
          let sourcePackage = result.sourcePackage;
          if (sourcePackage) {
            // console.log("hyperty has sourcePackage:", sourcePackage);
            hyperty.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
          }

          console.log('hyperty has sourcePackage:', hyperty);

          resolve(hyperty);
        }
      });

    });
  }

  /**
   * Get RuntimeDescriptor
   * @param runtimeURL - e.g. mydomain.com/.well-known/runtime/MyRuntime
   * @returns {Promise}
   */
   getRuntimeDescriptor(runtimeURL) {
     let _this = this;

     return new Promise(function(resolve, reject) {

       let dividedURL = divideURL(runtimeURL);
       let type = dividedURL.type;
       let domain = dividedURL.domain;
       let runtime = dividedURL.identity;

       if (runtime) {
         runtime = runtime.substring(runtime.lastIndexOf('/') + 1);
       }

       // request the json
       _this.httpRequest.get(type + '://' + domain + '/resources/descriptors/Runtimes.json').then(function(descriptor) {
         _this.Runtimes = JSON.parse(descriptor);

         let result = _this.Runtimes[runtime];

         if (result.ERROR) {
           // TODO handle error properly
           reject(result);
         } else {

           // parse capabilities first
           try {
             result.hypertyCapabilities = JSON.parse(result.hypertyCapabilities);
             result.protocolCapabilities = JSON.parse(result.protocolCapabilities);
           } catch (e) {
             // already json object
           }

           console.log('creating runtime descriptor based on: ', result);

           // create the descriptor
           let runtime = _this._factory.createHypertyRuntimeDescriptorObject(
             result.cguid,
             result.version,
             result.objectName,
             result.description,
             result.language,
             result.sourcePackageURL,
             result.type || result.runtimeType,
             result.hypertyCapabilities,
             result.protocolCapabilities
           );

           console.log('created runtime descriptor object:', runtime);

           // parse and attach sourcePackage
           let sourcePackage = result.sourcePackage;
           if (sourcePackage) {
             // console.log('runtime has sourcePackage:', sourcePackage);
             runtime.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
           }

           resolve(runtime);
         }
       });
     });
   }

  /**
  * Get source Package from a URL
  * @param sourcePackageURL - e.g. mydomain.com/.well-known/hyperty/MyHyperty/sourcePackage
  * @returns {Promise}
  */
  getSourcePackageFromURL(sourcePackageURL) {
    let _this = this;

    // console.log("getting sourcePackage from:", sourcePackageURL);

    return new Promise(function(resolve, reject) {

      if (sourcePackageURL === '/sourcePackage') {
        reject('sourcePackage is already contained in descriptor, please use it directly');
      }

      _this.httpRequest.get(sourcePackageURL).then(function(result) {
        // console.log("got raw sourcePackage:", result);
        if (result.error) {
          // TODO handle error properly
          reject(result);
        } else {
          result = JSON.parse(result);

          let sourcePackage = result.sourcePackage;
          if (sourcePackage) {
            sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
            resolve(sourcePackage);
          } else {
            reject('no source package');
          }
        }
      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

  /**
  * Get StubDescriptor
  * @param stubURL - e.g. mydomain.com/.well-known/protostub/MyProtostub
  * @returns {Promise}
  */
  getStubDescriptor(stubURL) {
    let _this = this;

    // console.log("getting stub descriptor from: " + stubURL);
    return new Promise(function(resolve, reject) {

      let dividedURL = divideURL(stubURL);
      let type = divideURL.type;
      let domain = dividedURL.domain;
      let protoStub = dividedURL.identity;

      if (!domain) {
        domain = stubURL;
      }

      if (!protoStub) {
        protoStub = 'default';
      } else {
        protoStub = protoStub.substring(protoStub.lastIndexOf('/') + 1);
      }

      _this.httpRequest.get(type + '://' + domain + '/resources/descriptors/ProtoStubs.json').then(function(descriptor) {
        _this.ProtoStubs = JSON.parse(descriptor);

        let result = _this.ProtoStubs[protoStub];

        if (result.error) {
          // TODO handle error properly
          reject(result);
        } else {
          console.log('creating stub descriptor based on: ', result);

          // create the descriptor
          let stub = _this._factory.createProtoStubDescriptorObject(
            result.cguid,
            result.version,
            result.objectName,
            result.description,
            result.language,
            result.sourcePackageURL,
            result.messageSchemas,
            JSON.stringify(result.configuration),
            result.constraints
          );

          // parse and attach sourcePackage
          let sourcePackage = result.sourcePackage;

          if (sourcePackage) {
            sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
            stub.sourcePackage = sourcePackage;
          }
          resolve(stub);
        }

      });
    });

  }

  /**
  * Get DataSchemaDescriptor
  * @param dataSchemaURL - e.g. mydomain.com/.well-known/dataschema/MyDataSchema
  * @returns {Promise}
  */
  getDataSchemaDescriptor(dataSchemaURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dividedURL = divideURL(dataSchemaURL);
      let type = divideURL.type;
      let domain = dividedURL.domain;
      let schemaURL = dividedURL.identity;

      // request the json
      if (schemaURL) {
        schemaURL = schemaURL.substring(schemaURL.lastIndexOf('/') + 1);
      }

      _this.httpRequest.get(type + '://' + domain + '/resources/descriptors/DataSchemas.json').then(function(descriptor) {

        _this.DataSchemas = JSON.parse(descriptor);

        let result = _this.DataSchemas[schemaURL];

        if (result.ERROR) {
          // TODO handle error properly
          reject(result);
        } else {
          console.log('creating dataSchema based on: ', result);

          // FIXME: accessControlPolicy field not needed?
          // create the descriptor
          let dataSchema = _this._factory.createDataObjectSchema(
            result.cguid,
            result.version,
            result.objectName,
            result.description,
            result.language,
            result.sourcePackageURL
          );

          console.log('created dataSchema descriptor object:', dataSchema);

          // parse and attach sourcePackage
          let sourcePackage = result.sourcePackage;
          if (sourcePackage) {
            // console.log('dataSchema has sourcePackage:', sourcePackage);
            dataSchema.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
            if (typeof dataSchema.sourcePackage.sourceCode === 'string') {
              dataSchema.sourcePackage.sourceCode = JSON.parse(dataSchema.sourcePackage.sourceCode);
            }
          }

          resolve(dataSchema);
        }
      });

    });
  }

  _createSourcePackage(factory, sp) {
    // console.log("creating sourcePackage. factory:", factory, ", raw package:", sp);
    try {
      sp = JSON.parse(sp);
    } catch (e) {
      console.log('parsing sourcePackage failed. already parsed? -> ', sp);
    }

    // check encoding
    if (sp.encoding === 'base64') {
      sp.sourceCode = atob(sp.sourceCode);
      sp.encoding = 'UTF-8';
    }

    let sourcePackage = factory.createSourcePackage(sp.sourceCodeClassname, sp.sourceCode);

    if (sp.hasOwnProperty('encoding'))
    sourcePackage.encoding = sp.encoding;

    if (sp.hasOwnProperty('signature'))
    sourcePackage.signature = sp.signature;

    return sourcePackage;
  }

}

export default RuntimeCatalogue;
