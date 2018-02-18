const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const pool = require('../../dist/db');
const DummyModel = require('../../dist/models/DummyModel').default;
const DummyProfile = require('../../dist/models/DummyProfile').default;

const createPersonsTableSQL = `CREATE TABLE IF NOT EXISTS persons (
  id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstName varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  lastName varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  createdOn varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  age int(10) UNSIGNED NOT NULL
);`;
const createProfilesTableSQL = `CREATE TABLE IF NOT EXISTS dummyProfiles (
  id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  personId int(10) UNSIGNED NOT NULL
);`;

const dropPersonsTableSQL = `DROP TABLE persons;`;
const dropProfilesTableSQL = `DROP TABLE dummyProfiles;`;

let timeoutIncr = 0;

function timeoutPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(timeoutIncr), timeoutIncr);
      timeoutIncr += 5;
    });
}

function createHelper(firstName, lastName, age) {
  return timeoutPromise()
  .then(() => DummyModel.create({ firstName, lastName, age }));
}

function assertPropsHelper(_id, _foo, _bar, _age) {
  return record => {
    expect(record.id).to.equal(_id);
    expect(record.firstName).to.equal(_foo);
    expect(record.lastName).to.equal(_bar);
    expect(record.age).to.equal(_age);
    expect(record.createdOn).to.equal(getTrucatedDate());
    return new Promise((resolve, reject) => resolve(record));
  };
}

function getTrucatedDate() {
  return new Date().toISOString().substr(0, 16);
}

function passLog(label) {
  return v => {
    console.log('\n\n######\\\\\\#\n#', label, '\n', v);
    return v;
  }
}

describe('DummyModel test', () => {

  const threeRecords = [
    ['joe', 'dalton', 27], ['averell', 'dalton', 22], ['poe', 'dameron', 27]
  ];

  /**
   * Create db table before starting
   */
  beforeEach(() => Promise.all([
      pool.query(createPersonsTableSQL),
      pool.query(createProfilesTableSQL)
    ])
    .then(() => { timeoutIncr = 0; })
  );

  /**
   * Drop db table when done
   */
  afterEach(() => Promise.all([
    pool.query(dropPersonsTableSQL),
    pool.query(dropProfilesTableSQL)
  ]));

  /**
   * Find all with no records
   */
  it('Finds all records - No records yet', () =>
    DummyModel.findAll()
    .then(records => {
      expect(records.length).to.equal(0);
    })
  );

  /**
   * Create record then retrieves it
   */
  it('Create record and retrieve it', () =>
    createHelper('john', 'difool', 44)
    .then(assertPropsHelper(1, 'john', 'difool', 44, getTrucatedDate()))
    .then(() => DummyModel.findAll())
    .then(records => (records[0]))
    .then(assertPropsHelper(1, 'john', 'difool', 44))
    .then(() => DummyProfile.findAll())
    .then(([profileRecord]) => {
      expect(profileRecord.id).to.equal(1);
      expect(profileRecord.personId).to.equal(1);
    })
  );

  /**
   * Create three records
   */
  it('Create three records and retrieve them all', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'averell', 'dalton', 22)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

  /**
   * Create three records and filter them by string value
   */
  it('Create three records and filter them by string value', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.findAll({ lastName: 'dalton' }))
    .then(([rec1, rec2]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'averell', 'dalton', 22)(rec2))
    )
  );

  /**
   * Create three records and filter them by integer value
   */
  it('Create three records and filter them by integer value', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.findAll({ age: 27 }))
    .then(([rec1, rec2]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec2))
    )
  );

  /**
   * Create three records and filter them by string and integer value
   */
  it('Create three records and filter them by string and integer value', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.findAll({ firstName: 'poe', age: 27 }))
    .then(([rec1, rec2]) => assertPropsHelper(3, 'poe', 'dameron', 27)(rec1))
  );

  /**
   * Create three records, delete one by id, and retrieve the remaining
   */
  it('Create three records, delete one by id, and retrieve the remaining', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.delete(2))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec2))
    )
  );

  /**
   * Create three records, delete one by id, and retrieve the remaining
   */
  it('Create three records, delete two by where condition, and retrieve the remaining', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.delete({ lastName: 'dalton' }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2]) => assertPropsHelper(3, 'poe', 'dameron', 27)(rec1))
  );

  /**
   * Create three records, update one by id, retrieve them all
   */
  it('Create three records, update one by id, retrieve them all', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.update(2, { firstName: 'jack', age: 25 }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'jack', 'dalton', 25)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

  /**
   * Create three records, update two by hash, retrieve them all
   */
  it('Create three records, update two by hash, retrieve them all', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.update({ lastName: 'dalton' }, { lastName: 'dawton' }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dawton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'averell', 'dawton', 22)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

  /**
   * Create three records, update one by hash, retrieve them all
   */
  it('Create three records, update one by hash, retrieve them all', () =>
    Promise.map(threeRecords, ([firstName, lastName, age]) => createHelper(firstName, lastName, age))
    .then(() => DummyModel.update({ lastName: 'dalton', age: 22 }, { firstName: 'john', lastName: 'dawton', age: 43 }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'john', 'dawton', 43)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

});