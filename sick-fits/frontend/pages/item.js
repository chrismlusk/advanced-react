import React, { Fragment } from 'react';
import SingleItem from '../components/SingleItem';

const Item = props => (
  <Fragment>
    <SingleItem id={props.query.id} />
  </Fragment>
);

export default Item;
