import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...fakeUser(), cart: [] } } }
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()] } } }
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: 'abc123' } },
    result: { data: { addToCart: { ...fakeCartItem(), quantity: 1 } } }
  }
];

describe('<AddToCart />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );
  });

  it('renders and matches snapshot', async () => {
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });

  it('adds an item to cart when clicked', async () => {
    let apolloClient;
    const wrapperWithConsumer = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapperWithConsumer.update();
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res.data.me.cart).toHaveLength(0);
    wrapperWithConsumer.find('button').simulate('click'); // add item
    await wait();
    const res2 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res2.data.me.cart).toHaveLength(1);
    expect(res2.data.me.cart[0].id).toBe('omg123');
    expect(res2.data.me.cart[0].quantity).toBe(3);
  });

  it('changes from `add` to `adding` when clicked', async () => {
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Add to Cart');
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding to Cart');
  });
});
