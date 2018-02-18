import Model from './Model';

class DummyProfile extends Model {

  static _fields = ['personId'];
  static _defaults = {};
  static _tableName = 'dummyProfiles';

}

Model._classes.DummyProfile = DummyProfile;
export default DummyProfile;