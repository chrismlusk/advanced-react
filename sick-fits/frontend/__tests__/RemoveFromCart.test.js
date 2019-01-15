import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION
} from '../components/RemoveFromCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

global.alert = console.log;

const testId = 'abc123';
const testCartItem = fakeCartItem({ id: testId });

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [testCartItem],
          orders: []
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: testId }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: testId
        }
      }
    }
  }
];

describe('<RemoveFromCart />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id={testId} />
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
            return <RemoveFromCart id={testId} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res.data.me.cart).toHaveLength(1);
    expect(res.data.me.cart[0].item.price).toBe(testCartItem.item.price);
    wrapperWithConsumer.find('button').simulate('click');
    await wait();
    const res2 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res2.data.me.cart).toHaveLength(0);
  });
});
