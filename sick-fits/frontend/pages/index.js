import React, { Fragment } from 'react';
import Items from '../components/Items';

const Home = props => (
  <Fragment>
    <Items page={Number(props.query.page) || 1} />
  </Fragment>
);

export default Home;
