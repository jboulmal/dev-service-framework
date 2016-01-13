class MessageBody{

    /**
     *
     * @param {Identity.JWT} idToken - token for Identity assertion purpose
     * @param {Identity.JWT} accessToken
     * @param {URL.URL} resource
     * @param {URL.HypertyCatalogueURL} schema
     * @param {Identity.JWT} assertedIdentity
     *
     */
	constructor(idToken, accessToken, resource, schema, assertedIdentity){
        //let _this = this;
        if(typeof idoken !== 'undefined')
            this.idToken = idToken;
        if(typeof accessToken  !== 'undefined')
            this.accessToken = accessToken;
        if(typeof resource !== 'undefined' )
            this.resource = resource;
        if(typeof schema !== 'undefined' )
            this.schema = schema;
        if(typeof assertedIdentity !== 'undefined')
            this.assertedIdentity = assertedIdentity;
	}
}

export class CreateMessageBody extends MessageBody {
    constructor(value, policy, idToken, accessToken, resource, schema, assertedIdentity){
        if(typeof value === 'undefined')
            throw new Error("The value parameter is null");
        super(idToken,accessToken, resource, schema, assertedIdentity, schema, assertedIdentity);

        this.value = value;
        if(policy)
            this.policy = policy;
    }
}

export class ReadMessageBody extends MessageBody {
    constructor( idToken, accessToken, resource, schema, assertedIdentity, attribute, criteriaSyntax, criteria){

        super(idToken,accessToken ,resource, schema, assertedIdentity );

        if(attribute)
            this.attribute = attribute;

        if(criteriaSyntax)
            this.criteriaSyntax = criteriaSyntax;

        if(criteria)
            this.criteria = criteria;
    }
}


export class DeleteMessageBody extends MessageBody {
    constructor(idToken, accessToken, resource, schema, assertedIdentity,attribute ){

        super(idToken,accessToken ,resource, schema, assertedIdentity );

        if(attribute){
            this.attribute = attribute;
        }
    }

}

export class UpdateMessageBody extends MessageBody {
    constructor(idToken, accessToken, resource, schema, assertedIdentity, attribute, value){


        super(idToken,accessToken ,resource, schema, assertedIdentity );

        this.attribute = attribute;
        this.value = value;
    }
}

export class ForwardMessageBody extends MessageBody {
    constructor(idToken, accessToken, resource, schema, assertedIdentity, message){


        super(idToken,accessToken ,resource, schema, assertedIdentity );

        this.message = message;
    }
}

export class ResponseMessageBody extends MessageBody {

    constructor(idToken, accessToken, resource, code, value){

        super(idToken,accessToken ,resource );

        if(code)
        {
            this.code = code;
            this.description = REASON_PHRASE[code];
        }

        if(value)
            this.value = value;
    }

}
export var RESPONS_CODE = {
    100: '100',
    101: '101',
    200: '200',
    201: '201',
    202: '202',
    203: '203',
    204: '204',
    205: '205',
    206: '206',
    300: '300',
    301: '301',
    302: '302',
    303: '303',
    304: '304',
    305: '305',
    307: '307',
    400: '400',
    401: '401',
    402: '402',
    403: '403',
    404: '404',
    405: '405',
    406: '406',
    407: '407',
    408: '408',
    409: '409',
    410: '410',
    411: '411',
    412: '412',
    413: '413',
    414: '414',
    415: '415',
    416: '416',
    417: '417',
    426: '426',
    500: '500',
    501: '501',
    502: '502',
    503: '503',
    504: '504',
    505: '505'
};
export var REASON_PHRASE = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    426: 'Upgrade Required',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version Not Supported'
};

export default MessageBody;
