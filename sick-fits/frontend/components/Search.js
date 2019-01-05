import React, { Component } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

export class AutoComplete extends Component {
  state = {
    items: [],
    loading: false
  };

  onChange = debounce(async (event, client) => {
    const searchTerm = event.target.value;

    if (!searchTerm) return this.setState({ items: [] });

    this.setState({ loading: true });

    // Manually query Apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm }
    });

    this.setState({
      items: res.data.items,
      loading: false
    });
  }, 350);

  routeToItem = item => {
    this.setState({ items: [] });
    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      }
    });
  }

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={this.routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item...',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: event => {
                        event.persist();
                        this.onChange(event, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img src={item.image} alt={item.title} width="50" />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing found</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
