import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import ErrorMessage from './ErrorMessage';
import PaginationStyles from './styles/PaginationStyles';
import { PER_PAGE } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ error, loading, data }) => {
      if (error) return <ErrorMessage error={error} />;
      if (loading) return <p>Loading...</p>;
      const { count } = data.itemsConnection.aggregate;
      const { page } = props;
      const pages = Math.ceil(count / PER_PAGE);
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              Sick Fits | Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 }
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              👈🏼 Prev
            </a>
          </Link>
          <p>
            Page {page} of <span className="total-pages">{pages}</span>
          </p>
          <p>{count} total items</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 }
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next 👉🏼
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
