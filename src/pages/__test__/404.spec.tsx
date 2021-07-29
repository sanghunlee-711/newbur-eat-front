import React from 'react';
import { render, waitFor } from '../../test-utils';
import { NotFound } from '../404';

describe('<NotFound/>', () => {
  it('renders ok', async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Newber Eats');
    });
  });
});
