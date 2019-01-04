import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RemoveFromCart from './RemoveFromCart';
import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.lightgrey};
  padding: 1rem 0;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  const { id, item, quantity } = cartItem;
  return (
    <CartItemStyles>
      {!item ? (
        <p>This item has been removed</p>
      ) : (
        <Fragment>
          <img width="100" src={item.image} alt={item.title} />
          <div className="cart-item-details">
            <h3>{item.title}</h3>
            <p>
              {formatMoney(item.price * quantity)}
              {' - '}
              <em>
                {quantity} &times; {formatMoney(item.price)} each
              </em>
            </p>
          </div>
        </Fragment>
      )}
      <RemoveFromCart id={id} />
    </CartItemStyles>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
