import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Item from '../components/Item';
import formatMoney from '../lib/formatMoney';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg'
};

describe('<Item />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Item item={fakeItem} />);
  });

  it('renders and matches the snapshot', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders title and price properly', () => {
    const Title = wrapper.find('Title a');
    const PriceTag = wrapper.find('PriceTag');
    expect(Title.text()).toBe(fakeItem.title);
    expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price));
  });

  it('renders the image properly', () => {
    const Image = wrapper.find('img');
    expect(Image.props().src).toBe(fakeItem.image);
    expect(Image.props().alt).toBe(fakeItem.title);
  });

  it('renders all buttons properly', () => {
    const ButtonList = wrapper.find('.buttonList');
    expect(ButtonList.children()).toHaveLength(3);
    expect(ButtonList.find('Link').exists()).toBe(true);
    expect(ButtonList.find('AddToCart').exists()).toBe(true);
    expect(ButtonList.find('DeleteItem').exists()).toBe(true);
  });
});
