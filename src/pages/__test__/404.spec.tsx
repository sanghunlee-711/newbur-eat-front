import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotFound } from '../404';

describe('<NotFound/>', () => {
  it('renders ok', async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Newber Eats');
    });
  });
});
