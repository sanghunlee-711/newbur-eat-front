describe('Create Account', () => {
  const user = cy;
  it('Should see email / password validation errors', () => {
    user.visit('/');
    user.findByText(/Create an Account/i).click();
    user.findAllByPlaceholderText(/email/i).type('bad@email');
    user.findByRole('alert').should('have.text', 'Please Enter a valid email');
    user.findAllByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');

    user.findAllByPlaceholderText(/email/i).type('good@email.com');
    user.findAllByPlaceholderText(/password/i).type('bad');
    user.findAllByPlaceholderText(/password/i).clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });

  it('Shoulde be able to create account and login ', () => {
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: 'CreateAccountOutPut',
              },
            },
          });
        });
      }
    });

    user.visit('/create-account');
    user.findAllByPlaceholderText(/email/i).type('real@test.com');
    user.findAllByPlaceholderText(/password/i).type('test');
    user.findByRole('button').click();

    user.wait(1000);
    user.title().should('eq', 'Login | Newber Eats');
    user.findByPlaceholderText(/email/i).type('real@test.com');
    user.findAllByPlaceholderText(/password/i).type('test');
    user.findByRole('button').click();
    user.window().its('localStorage.newber-token').should('be.a', 'string');
  });
});
