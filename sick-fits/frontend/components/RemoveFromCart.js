import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  background-color: none;
  border: 0;
  font-size: 3rem;

  &:hover {
    color: ${({ theme }) => theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  // This gets called as soon as we get a response
  // from the server after a mutation has happened.
  update = (cache, payload) => {

    // 1. read the cache
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY
    });

    // 2. remove item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, { error, loading }) => (
          <BigButton
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
            disabled={loading}
            title="Delete Item"
            type="button"
          >
            ✖️
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
