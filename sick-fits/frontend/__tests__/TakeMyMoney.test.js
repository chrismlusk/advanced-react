import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import NProgress from 'nprogress';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import TakeMyMoney from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

global.alert = console.log;

Router.router = {
  push: () => {}
};

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  }
];

describe('<TakeMyMoney />', () => {
  let wrapper;
  let component;

  const createOrderMock = jest.fn().mockResolvedValue({
    data: { createOrder: { id: 'abc123' } }
  });

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    component = wrapper.find('TakeMyMoney').instance();
  });

  it('renders and matches snapshot', async () => {
    await wait();
    wrapper.update();
    const Button = wrapper.find('ReactStripeCheckout');
    expect(toJSON(Button)).toMatchSnapshot();
  });

  it('creates an `onorder` token', async () => {
    component.onToken({ id: 'abc123' }, createOrderMock);
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: 'abc123' }
    });
  });

  it('turns on the progress bar', async () => {
    await wait();
    wrapper.update();
    NProgress.start = jest.fn();
    component.onToken({ id: 'abc123' }, createOrderMock);
    expect(NProgress.start).toHaveBeenCalled();
  });

  it('routes to the order page when completed', async () => {
    await wait();
    wrapper.update();
    Router.router.push = jest.fn();
    component.onToken({ id: 'abc123' }, createOrderMock);
    await wait();
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/order',
      query: { id: 'abc123' }
    });
  });
});
