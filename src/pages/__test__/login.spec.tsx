import { ApolloProvider } from '@apollo/client';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { Login, LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    //Login은 시작과 동시에 Mutation이 돌아가며 업데이트가 되므로 waitFor 구문 사
    await waitFor(() => {
      //provider를 실제와 동일한걸 사용하고 client만 mocking해서 테스트 하는 방법
      // 이걸 위해 mock-apollo-client node module을 다운 받음
      mockedClient = createMockClient();

      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });

  it('should render Ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Newber Eats');
    });
  });

  it('display email validation errors', async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);

    await waitFor(() => {
      //userEvent를 통해서 event를 실행시킬 수 있게 됨
      userEvent.type(email, 'this@wt');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it('display password required errors', async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    await waitFor(() => {
      //userEvent를 통해서 event를 실행시킬 수 있게 됨
      userEvent.type(email, 'test@ttestt.com');
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submits form and calls mutation', async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');
    const formData = {
      email: 'real@test.com',
      password: '123',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'XXXXX',
          error: 'mutation-error',
        },
      },
    });

    jest.spyOn(Storage.prototype, 'setItem');
    //중간에서 query를 intercept하여 mocking할수 있게 됨
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    //위의 jest.spyOn을 통해서 해당 value를 커버하는 라인을 작성해도 함수형 컴포넌트안의 함수는 coverage에 포함이 되지 않아 버림..
    expect(localStorage.setItem).toHaveBeenCalledWith('newber-token', 'XXXXX');
  });
});
