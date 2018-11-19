import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };

  initialState = {
    password: '',
    confirmPassword: ''
  };

  state = this.initialState;

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event, resetMutation) => {
    event.preventDefault();
    const success = await resetMutation();
    this.setState(this.initialState);
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => (
          <Form method="post" onSubmit={e => this.handleSubmit(e, reset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <ErrorMessage error={error} />
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="password">
                Confirm Password
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
