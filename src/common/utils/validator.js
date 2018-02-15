class Validator {

  messages = {
    email: 'Not a valid email',
    password: 'Password should be > 6 characters long and have lowercase AND uppercase letters, AND digits'
  };

  email(email) {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  }

  password(pw) {
    return pw.length >= 6 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
  }

  validate(name, value) {
    if(! this[name]) {
      throw new Error(`Validator ${name} does not exist!`);
    }
    const isValid = this[name](value);
    return isValid ? [true, undefined] : [false, this.messages[name]];
  }
}

export default new Validator();