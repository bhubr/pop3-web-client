const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const pool = require('../../dist/db');
const DummyModel = require('../../dist/models/DummyModel').default;

const createTableSQL = `CREATE TABLE IF NOT EXISTS dummyModels (
  id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  foo varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  bar varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  intVal int(10) UNSIGNED NOT NULL
);`;

const dropTableSQL = `DROP TABLE dummyModels`;

let timeoutIncr = 0;

function timeoutPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(timeoutIncr), timeoutIncr);
      timeoutIncr += 5;
    });
}

function createHelper(foo, bar, intVal) {
  return timeoutPromise()
  .then(() => DummyModel.create({ foo, bar, intVal }));
}

function assertPropsHelper(_id, _foo, _bar, _intVal) {
  return record => {
    expect(record.id).to.equal(_id);
    expect(record.foo).to.equal(_foo);
    expect(record.bar).to.equal(_bar);
    expect(record.intVal).to.equal(_intVal);
    return new Promise((resolve, reject) => resolve(record));
  };
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
  beforeEach(() => pool.query(createTableSQL)
    .then(() => { timeoutIncr = 0; })
  );

  /**
   * Drop db table when done
   */
  afterEach(() => pool.query(dropTableSQL));

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
    .then(assertPropsHelper(1, 'john', 'difool', 44))
    .then(() => DummyModel.findAll())
    .then(records => (records[0]))
    .then(assertPropsHelper(1, 'john', 'difool', 44))
  );

  /**
   * Create three records
   */
  it('Create three records and retrieve them all', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
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
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.findAll({ bar: 'dalton' }))
    .then(([rec1, rec2]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'averell', 'dalton', 22)(rec2))
    )
  );

  /**
   * Create three records and filter them by integer value
   */
  it('Create three records and filter them by integer value', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.findAll({ intVal: 27 }))
    .then(([rec1, rec2]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec2))
    )
  );

  /**
   * Create three records and filter them by string and integer value
   */
  it('Create three records and filter them by string and integer value', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.findAll({ foo: 'poe', intVal: 27 }))
    .then(([rec1, rec2]) => assertPropsHelper(3, 'poe', 'dameron', 27)(rec1))
  );

  /**
   * Create three records, delete one by id, and retrieve the remaining
   */
  it('Create three records, delete one by id, and retrieve the remaining', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
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
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.delete({ bar: 'dalton' }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2]) => assertPropsHelper(3, 'poe', 'dameron', 27)(rec1))
  );

  /**
   * Create three records, update one by id, retrieve them all
   */
  it('Create three records, update one by id, retrieve them all', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.update(2, { foo: 'jack', intVal: 25 }))
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
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.update({ bar: 'dalton' }, { bar: 'dawton' }))
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
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(() => DummyModel.update({ bar: 'dalton', intVal: 22 }, { foo: 'john', bar: 'dawton', intVal: 43 }))
    .then(() => DummyModel.findAll())
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'john', 'dawton', 43)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

});