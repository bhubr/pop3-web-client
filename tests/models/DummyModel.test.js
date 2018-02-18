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

function createHelper(foo, bar, intVal) {
  return DummyModel.create({ foo, bar, intVal });
}

function assertPropsHelper(_id, _foo, _bar, _intVal) {
  return record => {
    console.log('## assertPropsHelper', record, _id, _foo, _bar, _intVal);
    expect(record.id).to.equal(_id);
    expect(record.foo).to.equal(_foo);
    expect(record.bar).to.equal(_bar);
    expect(record.intVal).to.equal(_intVal);
    return new Promise((resolve, reject) => resolve(record));
  };
}

describe('DummyModel test', () => {

  const threeRecords = [
    ['joe', 'dalton', 27], ['averell', 'dalton', 22], ['poe', 'dameron', 27]
  ];

  /**
   * Create db table before starting
   */
  beforeEach(() => pool.query(createTableSQL));

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
   * Create record then retrieves it
   */
  it('Create three records and retrieve them', () =>
    Promise.map(threeRecords, ([foo, bar, intVal]) => createHelper(foo, bar, intVal))
    .then(([rec1, rec2, rec3]) => assertPropsHelper(1, 'joe', 'dalton', 27)(rec1)
      .then(() => assertPropsHelper(2, 'averell', 'dalton', 22)(rec2))
      .then(() => assertPropsHelper(3, 'poe', 'dameron', 27)(rec3))
    )
  );

});