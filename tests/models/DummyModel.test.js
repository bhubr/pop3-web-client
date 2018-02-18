const chai = require('chai');
const expect = chai.expect;
const pool = require('../../dist/db');
const DummyModel = require('../../dist/models/DummyModel').default;

const createTableSQL = `CREATE TABLE IF NOT EXISTS dummyModels (
  id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  foo varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  bar varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  intVal int(10) UNSIGNED NOT NULL
);`;

const dropTableSQL = `DROP TABLE dummyModels`;

describe('DummyModel test', () => {

  /**
   * Create db table before starting
   */
  before(() => pool.query(createTableSQL));

  /**
   * Drop db table when done
   */
  after(() => pool.query(dropTableSQL));

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
   * Create record
   */
  it('Create record', () =>
    DummyModel.create({
      foo: 'john', bar: 'difool', intVal: 44
    })
    .then(record => {
      console.log(record);
      expect(record.id).to.equal(1);
      expect(record.foo).to.equal('john');
      expect(record.bar).to.equal('difool');
      expect(record.intVal).to.equal(44);
    })
  );



});