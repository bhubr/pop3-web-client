import Model from './Model';

class DummyModel extends Model {

	static _fields = ['foo', 'bar', 'intVal'];
	static _tableName = 'dummyModels';

  static get callingClassType() { return this.name; }
}

Model._classes.DummyModel = DummyModel;
export default DummyModel;