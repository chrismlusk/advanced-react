import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CartCount count={10} />);
  });

  it('renders', () => {
    expect(wrapper);
  });

  it('matches the snapshot', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const wrapperForProps = shallow(<CartCount count={50} />);
    expect(toJSON(wrapperForProps)).toMatchSnapshot();
    wrapperForProps.setProps({ count: 10 });
    expect(toJSON(wrapperForProps)).toMatchSnapshot();
  });
});
