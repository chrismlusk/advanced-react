import React, { Fragment } from 'react';
import Reset from '../components/Reset';

const ResetPage = props => (
  <Fragment>
    <p>Reset your password</p>
    <Reset resetToken={props.query.resetToken} />
  </Fragment>
);

export default ResetPage;
