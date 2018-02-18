import Model from './Model';

class UserProfile extends Model {

  static _fields = ['userId', 'redirectTo'];
  static _defaults = {
  	redirectTo: '/profile'
  };
  static _tableName = 'userProfiles';

}

Model._classes.UserProfile = UserProfile;
export default UserProfile;