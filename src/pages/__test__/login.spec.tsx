import { render } from '@testing-library/react';
import React from 'react';
import { Login } from '../login';

describe('<Login />', () => {
  it('should render Ok', () => {
    render(<Login />);
  });
});
