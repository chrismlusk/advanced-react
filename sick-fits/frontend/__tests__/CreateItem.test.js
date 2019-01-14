import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';

const item = fakeItem();

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: item.image,
    eager: [{ secure_url: item.largeImage }]
  })
});

const mocks = [
  {
    request: {
      query: CREATE_ITEM_MUTATION,
      variables: {
        title: item.title,
        description: item.description,
        image: '',
        largeImage: '',
        price: item.price
      }
    },
    result: {
      data: {
        createItem: {
          ...fakeItem,
          id: 'abc123',
          __typename: 'Item'
        }
      }
    }
  }
];

describe('<CreateItem />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
  });

  it('renders and matches snapshot', () => {
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('uploads a file when changed', async () => {
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: [item.image] } });
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state.image).toEqual(item.image);
    expect(component.state.largeImage).toEqual(item.largeImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it('handles state updates', async () => {
    wrapper.find('#title').simulate('change', {
      target: { value: item.title, name: 'title' }
    });
    wrapper.find('#price').simulate('change', {
      target: { value: item.price, name: 'price', type: 'number' }
    });
    wrapper.find('#description').simulate('change', {
      target: { value: item.description, name: 'description' }
    });
    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: item.title,
      price: item.price,
      description: item.description
    });
  });

  it('creates and item when the form is submitted', async () => {
    const wrapperWithMocks = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    // simulate someone filling out the form
    wrapperWithMocks.find('#title').simulate('change', {
      target: { value: item.title, name: 'title' }
    });
    wrapperWithMocks.find('#price').simulate('change', {
      target: { value: item.price, name: 'price', type: 'number' }
    });
    wrapperWithMocks.find('#description').simulate('change', {
      target: { value: item.description, name: 'description' }
    });
    // mock the router
    Router.router = { push: jest.fn() };
    wrapperWithMocks.find('form').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: 'abc123' }
    });
  });
});
