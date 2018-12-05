import { Fragment } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <Fragment>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
          </Fragment>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
        {me && <Signout />}
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <button onClick={toggleCart} type="button">
              My Cart
              <CartCount
                count={me.cart.reduce((tally, cartItem) => {
                  return tally + cartItem.quantity;
                }, 0)}
              />
            </button>
          )}
        </Mutation>
      </NavStyles>
    )}
  </User>
);

export default Nav;
