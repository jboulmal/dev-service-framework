import DataObject from './DataObject';
import {ChangeType, ObjectType} from './SyncObject';

let FilterType = {ANY: 'any', START: 'start', EXACT: 'exact'};

class DataObjectObserver extends DataObject /* implements SyncStatus */ {
  /* private

  ----event handlers----
  _filters: {<filter>: {type: <start, exact>, callback: <function>} }
  */

  constructor(owner, url, schema, bus, initialStatus, initialData) {
    super(owner, url, schema, bus, initialStatus, initialData);
    let _this = this;

    _this._syncObj.observe((event) => {
      _this._onFilter(event);
    });

    _this._filters = {};

    //add listener for objURL
    bus.addListener(url, (msg) => {
      console.log('DataObjectObserver-' + url + '-RCV: ', msg);
      _this._changeObject(msg);
    });
  }

  //register change filter
  onChange(filter, callback) {
    let key = filter;
    let filterObj = {
      type: FilterType.EXACT,
      callback: callback
    };

    let idx = filter.indexOf('*');
    if (idx === filter.length - 1) {
      if (idx === 0) {
        filterObj.type = FilterType.ANY;
      } else {
        filterObj.type = FilterType.START;
        key = filter.substr(0, filter.length - 1);
      }
    }

    this._filters[key] = filterObj;
  }

  //filter changes
  _onFilter(event) {
    let _this = this;

    Object.keys(_this._filters).forEach((key) => {
      let filter = _this._filters[key];
      if (filter.type === FilterType.ANY) {
        //match anything
        filter.callback(event);
      } else if (filter.type === FilterType.START) {
        //if starts with filter...
        if (event.field.indexOf(key) === 0) {
          filter.callback(event);
        }
      } else if (filter.type === FilterType.EXACT) {
        //exact match
        if (event.field === key) {
          filter.callback(event);
        }
      }
    });
  }

  //receive and process change messages
  _changeObject(msg) {
    let _this = this;

    //TODO: update version ?
    //how to handle an incorrect version ? Example: receive a version 3 when the observer is in version 1, where is the version 2 ?
    //will we need to confirm the reception ?
    if (_this._version + 1 === msg.body.version) {
      _this._version++;
      let path = msg.body.attrib;
      let value = msg.body.value;
      let findResult = _this._syncObj.findBefore(path);

      if (msg.type === ChangeType.UPDATE) {
        findResult.obj[findResult.last] = value;
      } else {
        if (msg.type === ChangeType.ADD) {
          if (msg.body.oType === ObjectType.OBJECT) {
            findResult.obj[findResult.last] = value;
          } else {
            //ARRAY
            let arr = findResult.obj;
            let index = findResult.last;
            Array.prototype.splice.apply(arr, [index, 0].concat(value));
          }
        } else {
          //REMOVE
          if (msg.body.oType === ObjectType.OBJECT) {
            delete findResult.obj[findResult.last];
          } else {
            //ARRAY
            let arr = findResult.obj;
            let index = findResult.last;
            arr.splice(index, value);
          }
        }
      }
    } else {
      //TODO: how to handle unsynchronized versions?
      console.log('unsynchronized versions');
    }
  }
}

export default DataObjectObserver;
