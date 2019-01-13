import { Fragment } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';
import User from './User';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles data-test="nav">
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
        {me && (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => (
              <button onClick={toggleCart} type="button">
                My Cart
                <CartCount
                  count={me.cart.reduce(
                    (tally, cartItem) => tally + cartItem.quantity,
                    0
                  )}
                />
              </button>
            )}
          </Mutation>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
