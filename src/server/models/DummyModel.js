import Model from './Model';
import DummyProfile from './DummyProfile';

class DummyModel extends Model {

	static _fields = ['firstName', 'lastName', 'age', 'createdOn'];
  static _defaults = {
    createdOn: ''
  };
	static _tableName = 'persons';

  // static get callingClassType() { return this.name; }

  static beforeCreate(props, ...extraArgs) {
    // console.log({
    //   ...props, createdOn: new Date().toISOString().substr(0, 16)
    // })
    return {
      ...props, createdOn: new Date().toISOString().substr(0, 16)
    };
  }

  static afterCreate(person) {
    return DummyProfile.create({
      personId: person.id
    });
  }
}

Model._classes.DummyModel = DummyModel;
export default DummyModel;