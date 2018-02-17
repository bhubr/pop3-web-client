import React from 'react';
import validator from '../utils/validator';

export default class GenericValidatedForm extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);

    const { fields, initialValues } = props;

    console.log('GenericValidatedForm ctor', this);
    this.state = fields.reduce((carry, f) => (
      Object.assign(carry, { [f.name]: { value: initialValues[f.name] ? initialValues[f.name] : '', isValid: true, validErrMsg: '' } })
    ), {});


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const [ isValid, validErrMsg ] = validator.validate(name, value);

    let changedValues = { [name]: { value, isValid, validErrMsg } };
    this.setState((prevState, props) => Object.assign(
      { ...prevState }, changedValues
    ));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    let payload = {};
    for(let k in this.state) {
      payload[k] = this.state[k].value
    };
    this.props.onSubmit(payload);
  }

  render() {
    const { title, fields, errorMessage, isPending } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="pure-form pure-form-stacked">
        <h5>{title}</h5>
        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
        {isPending ? <div className="alert alert-loading">LOADING</div> : ''}

        {fields.map(f => {
          const { value, isValid, validErrMsg } = this.state[f.name];
          return (
            <div key={f.name} className="row">
              <div className="input-field col s12">
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  className={"validate " + (value ? (isValid ? 'valid' : 'invalid') : '') }
                  value={value}
                  onChange={this.handleChange} />
                {isValid ? '' : <span className="invalid-text">{validErrMsg}</span>}
                {f.type !== 'hidden' ? <label htmlFor={f.name}>{f.name}</label> : ''}
              </div>
            </div>
          );
        } )}

        <button type="submit" className="col s12 btn btn-large waves-effect indigo">{title}</button>
      </form>
    );
  }
}
