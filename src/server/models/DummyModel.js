import Model from './Model';

class DummyModel extends Model {

	static _fields = ['firstName', 'lastName', 'age', 'createdOn'];
  static _defaults = {
    createdOn: ''
  };
	static _tableName = 'persons';

  static get callingClassType() { return this.name; }

  static beforeCreate(props, ...extraArgs) {
    console.log({
      ...props, createdOn: new Date().toISOString().substr(0, 16)
    })
    return {
      ...props, createdOn: new Date().toISOString().substr(0, 16)
    };
  }
}

Model._classes.DummyModel = DummyModel;
export default DummyModel;