import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  initialState = {
    email: ''
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
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(reset, { error, loading, called }) => (
          <Form method="post" onSubmit={e => this.handleSubmit(e, reset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Forgot your password?</h2>
              <ErrorMessage error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  value={this.state.email}
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

export default RequestReset;
