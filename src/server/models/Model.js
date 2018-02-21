import pool from '../db';
import { isInt } from '../utils';

// https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
function mysqlEscape (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\"+char; // prepends a backslash to backslash, percent,
                          // and double/single quotes
    }
  });
}

function trimAndQuote(v) {
  return typeof v === 'string' ?
    "'" + mysqlEscape(v.trim()) + "'" : v;
}

export default class Model {

  static _classes = {};
  static _defaults = {};

  /**
   * Constructor: assign all passed props to instance properties
   */
  constructor(props) {
    this._propKeys = Object.keys(props);
    for(let p in props) {
      this[p] = props[p];
    }
    // console.log('Model default constructor', props, this);
  }

  // static get callingClassType() { return this.name; }

  /**
   * Get comma-separated fields list
   */
  static getFieldsString() {
    return this._fields.join(',');
  }


  /**
   * Convert a query hash to a where condition
   *
   * e.g. { name: 'foo', age: 12 } => " WHERE foo='name' AND age=12"
   */
  static getWhereCondition(whereHash) {
    whereHash = whereHash !== undefined ? whereHash : {};
    let whereStrings = [];
    for(let k in whereHash) {
      if(whereHash[k] === undefined) {
        throw new Error(`No value set for key ${k} in where hash`);
      }
      whereStrings.push(k + '=' + trimAndQuote(whereHash[k]));
    }
    return whereStrings.length ? 'WHERE ' + whereStrings.join(' AND ') : '';
  }

  /**
   * Find all records
   */
  static findAll(whereHash) {
    const fieldsString = this.getFieldsString();
    const whereCondition = this.getWhereCondition(whereHash);
    const query = `select id,${fieldsString} from ${this._tableName} ${whereCondition} ORDER by id asc`;
    // console.log('findAll query:', query, 'where:', whereCondition);
    return pool
      .query(query);
  }

  /**
   * Find a record by its id
   */
  static findOne(id) {
    const fieldsString = this.getFieldsString();
    const selectQuery = `select id,${fieldsString} from ${this._tableName} where id = ${id}`;
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(props => new this._classes[this.name](props));
  }

  /**
   * Func to be executed before actual object creation.
   * Only calls beforeCreate().
   */
  static _beforeCreate(props, ...args) {
    // console.log('_beforeCreate', props, args)
    return new Promise((resolve, reject) => resolve(
      this.beforeCreate(props, args)
    ));
  }

  /**
   * This one is a stub meant to be overridden by subclasses.
   */
  static beforeCreate(props, ...args) {
    // console.log('beforeCreate', props, args)
    return props;
  }

  /**
   * Func to be executed after object creation. Calls _afterCreate().
   */
  static _afterCreate(props, ...args) {
    // console.log('_beforeCreate', args)
    return new Promise((resolve, reject) => resolve(
      this.afterCreate(props, args)
    ));
  }

  /**
   * This one is a stub meant to be overridden by subclasses.
   */
  static afterCreate(props, ...args) {
    return props;
  }

  /**
   * Func to be executed before actual object creation.
   *
   * This one is a stub meant to be overridden by subclasses.
   */
  static _beforeCreate(...args) {
    // console.log('Model._beforeCreate', args);
    return new Promise((resolve, reject) => resolve(
      this.beforeCreate.apply(this, args)
    ));
  }

  static beforeCreate(...args) {
    return new Promise((resolve, reject) => resolve(args[0]));
  }

  /**
   * Func to be executed before object upddate.
   */
  static _beforeUpdate(...args) {
    return new Promise((resolve, reject) => resolve(
      this.beforeUpdate.apply(this, args)
    ));
  }

  static beforeUpdate(...args) {
    return new Promise((resolve, reject) => resolve(args[0]));
    // return props;
  }


  /**
   * Create a record
   */
  static create(props, ...args) {
    props = Object.assign(this._defaults, props);
    const requiredKeys = this._fields;
    for(let i = 0 ; i < requiredKeys.length ; i++) {
      const k = requiredKeys[i];
      if(typeof props[k] === 'undefined') {
        return Promise.reject(new Error(`required key '${k}' is missing`));
      }
    }
    for(let k in props) {
      if(requiredKeys.indexOf(k) === -1) {
        return Promise.reject(new Error(`unexpected key '${k}'`));
      }
    }
// console.log('before beforeCreate', props);
    return this._beforeCreate.apply(this, [props, ...args])
    .then(props => {
      const fields = Object.keys(props).join(',');
      const values = Object.values(props).map(trimAndQuote).join(',');
      const insertQuery = `insert into ${this._tableName}(${fields}) values(${values})`;
      // console.log('after beforeCreate', props, insertQuery);
      return pool
        .query(insertQuery)
        .then(result => this.findOne(result.insertId))
        .then(record => this._afterCreate(record)
          .then(() => (record))
        );
    });
  }

  /**
   * Delete one or many records
   *
   * idOrWhere can be an integer or a hash
   */
  static delete(idOrWhere) {
    // https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
    const whereCondition = isInt(idOrWhere) ?
      `where id = ${idOrWhere}` : this.getWhereCondition(idOrWhere);
    const deleteQuery = `delete from ${this._tableName} ${whereCondition}`;
    return pool
      .query(deleteQuery);
  }

  /**
   * Update one or many records
   */
  static update(idOrWhere, props) {
    // https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
    const isById = isInt(idOrWhere);
    const whereCondition = isById ?
      `where id = ${idOrWhere}` : this.getWhereCondition(idOrWhere);

    return this.beforeUpdate(props)
    .then(props => {
      let setFieldsArr = [];
      for(let p in props) {
        // Skip id key
        if(p === 'id') {
          continue;
        }
        setFieldsArr.push(`${p} = ` + trimAndQuote(props[p]));
      }
      const setFields = setFieldsArr.join(',');
      const updateQuery = `update ${this._tableName} set ${setFields} ${whereCondition}`;
      // console.log('## updateQuery', updateQuery);
      return pool
      .query(updateQuery)
      .then(() => isById ? this.findOne(idOrWhere) :
        this.findAll(idOrWhere)
      );

    });
  }

  toPOJO() {
    let obj = {};
    this._propKeys.forEach(p => {
      obj[p] = this[p];
    });
    return obj;
  }

}