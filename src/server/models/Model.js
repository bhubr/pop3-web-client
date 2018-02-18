import pool from '../db';

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
  static classes = {};

  /**
   * Constructor: assign all passed props to instance properties
   */
  constructor(props) {
    for(let p in props) {
      this[p] = props[p];
    }
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
    const baseQuery = `select id,${fieldsString} from ${this._tableName} ${whereCondition} ORDER by id asc`;

    return pool
      .query(baseQuery);
  }

  /**
   * Find a record by its id
   */
  static findOne(id) {
    const fieldsString = this.getFieldsString();
    const selectQuery = `select id,${fieldsString} from ${this._tableName} where id = ${id}`;
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(props => new this.classes[this.name](props));
  }

  /**
   * Func to be executed before actual object creation.
   *
   * This one is a stub meant to be overridden by subclasses.
   */
  static beforeCreate(props, ...extraArgs) {
    return new Promise((resolve, reject) => resolve(props));
  }

  /**
   * Create a record
   */
  static create(...args) {
    const props = args[0];
    const requiredKeys = this._fields;
    for(let i = 0 ; i < requiredKeys.length ; i++) {
      const k = requiredKeys[i];
      if(! props[k]) {
        return Promise.reject(new Error(`required key '${k}' is missing`));
      }
    }
    for(let k in props) {
      if(requiredKeys.indexOf(k) === -1) {
        return Promise.reject(new Error(`unexpected key '${k}'`));
      }
    }

    return this.beforeCreate(props)
    .then(props => {
      const fields = Object.keys(props).join(',');
      const values = Object.values(props).map(trimAndQuote).join(',');
      const insertQuery = `insert into ${this._tableName}(${fields}) values(${values})`;
      return pool
        .query(insertQuery)
        .then(result => this.findOne(result.insertId));
    });
  }

  /**
   * Delete one or many records
   *
   * idOrWhere can be an integer or a hash
   */
  static delete(idOrWhere) {
    // https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
    const whereCondition = (idOrWhere === parseInt(idOrWhere, 10)) ?
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
    const whereCondition = (idOrWhere === parseInt(idOrWhere, 10)) ?
      `where id = ${idOrWhere}` : this.getWhereCondition(idOrWhere);
    let setFieldsArr = [];
    for(let p in props) {
      setFieldsArr.push(`${p} = ` + trimAndQuote(props[p]));
    }
    const setFields = setFieldsArr.join(',');
    const updateQuery = `update ${this._tableName} set ${setFields} ${whereCondition}`;
    return pool
      .query(updateQuery);
  }
}