import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from '../restaurant';

describe('<Restaurant />', () => {
  it('render ok with props', () => {
    const restaurantProps = {
      id: '1',
      name: 'name',
      categoryName: 'categoryName',
      coverImg: 'lala',
    };

    const { debug, getByText, container } = render(
      <Router>
        <Restaurant
          id="1"
          coverImg="x"
          name="nameTest"
          categoryName="cateTest"
        />
      </Router>
    );
    debug();
    getByText('nameTest');
    getByText('cateTest');
    expect(container.firstChild).toHaveAttribute('href', '/restaurants/1');
  });
});
