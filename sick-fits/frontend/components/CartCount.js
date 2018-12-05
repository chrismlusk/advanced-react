import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Dot = styled.div`
  background-color: ${({ theme }) => theme.red};
  border-radius: 50%;
  color: white;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  line-height: 2rem;
  margin-left: 1rem;
  min-width: 3rem;
  padding: .5rem;
`;

const CartCount = ({ count }) => (
  <Dot>
    {count}
  </Dot>
);

export default CartCount;
