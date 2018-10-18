import React, { Fragment } from 'react';
import UpdateItem from '../components/UpdateItem';

const Update = props => (
  <Fragment>
    <UpdateItem id={props.query.id} />
  </Fragment>
);

export default Update;
