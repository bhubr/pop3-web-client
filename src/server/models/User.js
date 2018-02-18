import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import Model from './Model';
import UserProfile from './UserProfile';

const hashAsync = Promise.promisify(bcrypt.hash);
const compareAsync = Promise.promisify(bcrypt.compare);
const SALT_ROUNDS = 10;

// function trimAndQuote(v) {
//   return typeof v === 'string' ?
//     "'" + v.trim() + "'" : v;
// }

// function passLog(v) {
//   console.log('passLog', v); return v;
// }

class User extends Model {

  static _fields = ['email', 'password'];
  static _defaults = {};
  static _tableName = 'users';

  constructor(props) {
    super(props);
    delete this.password;
  }

  static hashPassword(password) {
    return hashAsync(password, SALT_ROUNDS);
  }

  // static findAll() {
  //   return pool
  //     .query('select `id`, `email` from users');
  // }

  // static findOne(id) {
  //   const selectQuery = `select id, email from users where id = ${id}`;
  //   return pool.query(selectQuery)
  //     .then(records => (records[0]));
  // }

  static beforeCreate(user) {
    return this.hashPassword(user.password)
      .then(password => Object.assign(user, {
        password
      }));
  }

  static getByEmail(email) {
    return this.findAll({ email })
    // const selectQuery = `select id, email, password from users where email = '${email}'`;
    // return pool
    //   .query(selectQuery)
      .then(records => (records[0]));
  }

  static checkPassword(dbUser, password) {
    console.log('### checkPassword', dbUser, password);
    return compareAsync(password, dbUser.password)
    .then(matches => (matches ? dbUser : false));
  }

  static authenticate(credentials) {
    console.log('Server-side User.authenticate', credentials);
    return User.getByEmail(credentials.email)
    .then(user => (! user ? false :
      User.checkPassword(user, credentials.password)
    ))
  }

  static afterCreate(user) {
    return UserProfile.create({
      userId: user.id
    });
  }

  // static create(user) {
  //   const requiredKeys = ['email', 'password'];
  //   const optionalKeys = ['first_name', 'last_name'];
  //   for(let i = 0 ; i < requiredKeys.length ; i++) {
  //     const k = requiredKeys[i];
  //     if(! user[k]) {
  //       return Promise.reject(new Error(`required key '${k}' is missing`));
  //     }
  //   }
  //   for(let k in user) {
  //     if(requiredKeys.indexOf(k) === -1 && optionalKeys.indexOf(k) === -1) {
  //       return Promise.reject(new Error(`unexpected key '${k}'`));
  //     }
  //   }

  //   return User.beforeCreate(user)
  //     .then(user => {
  //       const fields = Object.keys(user).join(',');
  //       const values = Object.values(user).map(trimAndQuote).join(',');
  //       const insertQuery = `insert into users(${fields}) values(${values})`;
  //       return pool
  //         .query(insertQuery)
  //         .then(result => User.findOne(result.insertId));
  //     })
  // }

  // static delete(id) {
  //   const deleteQuery = 'delete from users where id = ' + id;
  //   return pool
  //     .query(deleteQuery);
  // }

}

Model._classes.User = User;
export default User;
