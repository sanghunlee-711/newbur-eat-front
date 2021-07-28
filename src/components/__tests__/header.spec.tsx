import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ME_QUERY } from '../../hooks/useMe';
import { Header } from '../header';

describe('<Header />', () => {
  //여기서 렌더 조건 테스트를 위해 hook으로 만든 useMe를 모킹하여 사이드이펙트를 만드는 것이 아니라
  // 사이드이펙트 발생 방지를 위해 query를 mocking할 것 임

  it('renders with verfiy banner', async () => {
    // query 변경으로 state를 업데이트하여 rerender를 시키기 때문에 waitFor가 필요
    // mockProvier에서 쿼리를 변경을 하고 rerender가 될 것 같으면
    //  await new Promise(resolve => setTimeout(resolve, 0)); 사용
    await waitFor(async () => {
      const { getByText } = render(
        //query의 result(결과)를 모킹하는 방법
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText('Please veify your email.');
    });
  });

  it('renders without verfiy banner', async () => {
    // query 변경으로 state를 업데이트하여 rerender를 시키기 때문에 waitFor가 필요
    // mockProvier에서 쿼리를 변경을 하고 rerender가 될 것 같으면
    //  await new Promise(resolve => setTimeout(resolve, 0)); 사용
    await waitFor(async () => {
      const { queryByText } = render(
        //query의 result(결과)를 모킹하는 방법
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      //queryByText는 존재하지 않으면 null을 return해주기 때문에 미존재 여부를 찾을 때는 queryBy를 사옹하면 됨

      expect(queryByText('Please veify your email.')).toBeNull();
    });
  });
});
