import { MockedProvider } from '@apollo/client/testing';
import { RenderResult, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils';
import { Category, CATEGORY_QUERY } from '../category';

describe('<Category />', () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(async () => {
      renderResult = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CATEGORY_QUERY,
                variables: {
                  input: {
                    page: 1,
                    slug: 'slug',
                  },
                },
              },
              result: {
                data: {
                  category: {
                    ok: true,
                    errror: null,
                    totalPages: 1,
                    totalResults: 1,
                    restaurants: [
                      {
                        __typename: 'Restaurant',
                        id: 1,
                        name: 'test-restaurant',
                        coverImg: 'test-coverimg-url',
                        category: {
                          __typename: 'Category',
                          name: 'test-category-name',
                        },
                        address: 'test-address',
                        isPromoted: true,
                      },
                    ],
                    category: {
                      __typename: 'Category',
                      id: 1,
                      name: 'test-category-name',
                      coverImg: 'test-img-url',
                      slug: 'slug',
                      restaurantCount: 1,
                    },
                  },
                },
              },
            },
          ]}
        >
          <Category />
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  test('renders ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Category Search | NewberEats');
    });
  });

  test('data is only one , link length is 1', async () => {
    const { getByText, debug } = renderResult;
    await waitFor(() => {
      debug();
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
