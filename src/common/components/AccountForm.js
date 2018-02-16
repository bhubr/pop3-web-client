import React from 'react';
import { connect } from 'react-redux';
import { createAccount } from '../actions';
import GenericValidatedForm from './GenericValidatedForm';

const fields = ['type', 'host', 'port', 'identifier', 'password', 'userId', 'userPass'];

// https://medium.com/netscape/connecting-react-component-to-redux-store-with-render-callback-53fd044bb42b
const AccountForm = ({ onSubmit, errorMessage, initialValues, isPending }) => (
  <GenericValidatedForm title="Account" fields={fields} initialValues={initialValues} onSubmit={onSubmit} errorMessage={errorMessage} isPending={isPending} />
);

export default connect(
  (state) => ({
    errorMessage: state.accounts.creationError,
    isPending: state.accounts.isCreating,
    initialValues: { userId: state.session.user.id, userPass: state.session.upw }
  }),
  {
    onSubmit: createAccount
  }
)(AccountForm);