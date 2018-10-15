import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';
import NProgress from 'nprogress';
import Nav from './Nav';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;

    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-7deg);

  a {
    background-color: ${props => props.theme.red};
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    text-transform: uppercase;
  }

  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Sick Fits</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">Search</div>
    <div>Cart</div>
  </StyledHeader>
);

export default Header;
