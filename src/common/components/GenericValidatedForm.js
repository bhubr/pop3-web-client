import React from 'react';
import validator from '../utils/validator';

export default class GenericValidatedForm extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);

    const { fields, initialValues } = props;

    console.log('GenericValidatedForm ctor', this);
    this.state = fields.reduce((carry, f) => (
      Object.assign(carry, { [f]: { value: initialValues[f] ? initialValues[f] : '', isValid: true, validErrMsg: '' } })
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
      <div className="pure-u-1">

        <form onSubmit={this.handleSubmit} className="pure-form pure-form-stacked">
            <fieldset>
                <legend>{title}</legend>
                {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
                {isPending ? <div className="alert alert-loading">LOADING</div> : ''}

                {fields.map(f => {
                  const { value, isValid, validErrMsg } = this.state[f];
                  return (
                  <div key={f}>
                    <label htmlFor={f}>{f}</label>
                    <input
                      id={f}
                      name={f}
                      type={f}
                      className={"form-control " + (isValid ? 'valid-input' : 'invalid-input')}
                      placeholder={f}
                      value={value}
                      onChange={this.handleChange} />
                    {isValid ? '' : <span className="invalid-text pure-form-message">{validErrMsg}</span>}

                  </div>
                ); } )}

                <button type="submit" className="pure-button pure-button-primary">{title}</button>
            </fieldset>
        </form>

      </div>
    );
  }
}