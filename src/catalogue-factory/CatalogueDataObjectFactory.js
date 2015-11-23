import RethinkObject from '../reTHINKObject/RethinkObject';

import CatalogueDataObject from './CatalogueDataObject';
import {CatalogueObjectType} from './CatalogueDataObject';
import {DataObjectSourceLanguage} from './CatalogueDataObject';

import SourcePackage from './SourcePackage';

import HypertyDescriptor from './HypertyDescriptor';
import {HypertyType} from './HypertyDescriptor';

import ProtocolStubDescriptor from './ProtocolStubDescriptor';

import HypertyRuntimeDescriptor from './HypertyRuntimeDescriptor';
import {RuntimeType} from './HypertyRuntimeDescriptor';
import {RuntimeProtocolCapabilityType} from './HypertyRuntimeDescriptor';
import {RuntimeHypertyCapabilityType} from './HypertyRuntimeDescriptor';

import PolicyEnforcerDescriptor from './PolicyEnforcerDescriptor';
import DataObjectSchema from './DataObjectSchema';

class CatalogueDataObjectFactory extends RethinkObject {

    /**
     * Constructor
     * @param {boolean} validation
     * @param {URL.URL } schema - link to the schema
     */
    constructor(validation, schema) {
        super(validation, schema);
    }

    createCatalogueDataObject(guid, type, objectName, description, language, sourcePackageURL) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new CatalogueDataObject(guid, type, objectName, description, language, sourcePackageURL);
    }

    createHypertyDescriptorObject(guid, catalogueType, objectName, description, language, sourcePackageURL, hypertyType,
                                  dataObjects) {
        if (
            typeof guid === "undefined"
            || typeof catalogueType === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof hypertyType === "undefined"
            || typeof dataObjects === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new HypertyDescriptor(guid, catalogueType, objectName, description, language, sourcePackageURL,
            hypertyType, dataObjects);
    }

    createProtoStubDescriptorObject(guid, type, objectName, description, language, sourcePackageURL, messageSchemas,
                                    configurationList, constraintList) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof messageSchemas === "undefined"
            || typeof configurationList === "undefined"
            || typeof constraintList === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new ProtocolStubDescriptor(guid, type, objectName, description, language, sourcePackageURL,
            messageSchemas, configurationList, constraintList);
    }

    createHypertRuntimeDescriptorObject(guid, catalogueType, objectName, description, language, sourcePackageURL,
                                        runtimeType, hypertyCapabilities, protocolCapabilities) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof runtimeType === "undefined"
            || typeof hypertyCapabilities === "undefined"
            || typeof protocolCapabilities === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new HypertyRuntimeDescriptor(guid, catalogueType, objectName, description, language, sourcePackageURL,
            runtimeType, hypertyCapabilities, protocolCapabilities);
    };

    createPolicyEnforcerDescriptorObject(guid, type, objectName, description, language, sourcePackageURL, configuration,
                                         policies) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof configuration === "undefined"
            || typeof policies === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new PolicyEnforcerDescriptor(guid, type, objectName, description, language, sourcePackageURL,
            configuration, policies);
    }

    createDataObjectSchema(guid, type, objectName, description, language, sourcePackageURL) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new DataObjectSchema(guid, type, objectName, description, language, sourcePackageURL);
    }

}

export default CatalogueDataObjectFactory;