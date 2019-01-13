import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import PleaseSignIn from '../components/PleaseSignIn';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

describe('<PleaseSignIn />', () => {
  it('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Please sign in');
    const SignIn = wrapper.find('Signin');
    expect(SignIn.exists()).toBe(true);
  });

  it('renders the child component when users are signed in', async () => {
    const Test = () => <p>Test!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Test />
        </PleaseSignIn>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.contains(<Test />)).toBe(true);
  });
});
