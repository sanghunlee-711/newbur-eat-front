import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '../../test-utils';
import { UserRole } from '../../__generated__/globalTypes';
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  //실제 모듈(라이브러리)의 모든것을 가져올 수 있게 된다.
  const realModule = jest.requireActual('react-router-dom');

  return {
    ...realModule,
    //아래와 같이 하나의 메서드만 모킹 해버리면 라이브러리 전체가 하나의 메서드만 가진애로 대체되기 때문에
    // 그냥 다 고장나버린다(실제로 존재하는 모든걸 모킹할게 아니라면 ..)
    // 그래서 realModule을 붙여주는 것이다.
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('CreateAccount', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it('renders ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Create Account | Newber Eats');
    });
  });

  it('renders validation Error', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');

    await waitFor(() => {
      userEvent.type(email, 'email@worknot');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please Enter a valid email');
    await waitFor(() => {
      userEvent.clear(email);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);

    await waitFor(() => {
      userEvent.type(email, 'real@email.com');
      userEvent.click(button);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submits mutation with form values', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'working@email.com',
      password: 'workingpassword',
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );

    jest.spyOn(window, 'alert').mockImplementation(() => null);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenLastCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');
    const mutationError = getByRole('alert');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mutationError).toHaveTextContent('mutation-error');
  });

  afterAll(() => {
    //모든 테스트가 끝나고 모킹한 모든것을 원상복귀 시키기 위함.
    jest.clearAllMocks();
  });
});
