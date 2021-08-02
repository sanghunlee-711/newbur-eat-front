describe('Log In', () => {
  const user = cy;

  it('should go to hompage', () => {
    //types를 cypress로 설정해줬기에 cy변수 사용가능
    user.visit('/').title().should('eq', 'Login | Newber Eats');
    //When visiting localhost:3000 title should equal with Login ~~
  });

  it('can see email / password validation errors', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('fail.com');
    user.findByRole('alert').should('have.text', 'Please Enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');

    user.findByPlaceholderText(/email/i).type('bad@email.com');
    user
      .findAllByPlaceholderText(/password/i)
      .type('test')
      .clear();

    user.findByRole('alert').should('have.text', 'Password is required');
  });

  it('can fill out the form', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('legend@test.com');
    user.findByPlaceholderText(/password/i).type('test');
    user
      .findByRole('button')
      .should('not.have.class', 'pointer-events-none')
      .click();
    user.window().its('localStorage.newber-token').should('be.a', 'string');
    //to do (can log in)
  });

  it('sign up', () => {
    user.visit('/create-account');
  });
});
