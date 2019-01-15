import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { fakeOrder } from '../lib/testUtils';

const testOrder = fakeOrder();

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: testOrder.id } },
    result: { data: { order: fakeOrder() } }
  }
];

describe('<Order />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id={testOrder.id} />
      </MockedProvider>
    );
  });

  it('renders and matches the snapshot', async () => {
    await wait();
    wrapper.update();
    const order = wrapper.find('div[data-test="order"]');
    const OrderItem = wrapper.find('OrderItem');
    expect(toJSON(order)).toMatchSnapshot();
    expect(OrderItem).toHaveLength(2);
  });
});
