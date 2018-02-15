class Validator {

  messages = {
    type: 'Account type should be POP3 or IMAP',
    host: 'Host should be a valid hostname or IP',
    port: 'Port should be a numeric value',
    identifier: 'identifier should be a valid value',
    email: 'Not a valid email',
    password: 'Password should be >= 5 characters long and have lowercase AND uppercase letters, AND digits'
  };

  host(host) {
    return true;
  }

  port(port) {
    return /[0-9]+/.test(port);
  }

  type(type) {
    return ['POP3', 'IMAP'].indexOf(type) !== -1;
  }

  identifier(identifier) {
    return true;
  }

  email(email) {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  }

  password(pw) {
    return pw.length >= 5 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
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