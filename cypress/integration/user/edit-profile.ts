describe('Edit Profile', () => {
  const user = cy;

  beforeEach(() => {
    user.login('legend@test.com', 'test');
  });

  it('can go to /edit-profile using the header', () => {
    user.get("a[href='/edit-profile']").click();
    user.wait(2000);
    user.title().should('eq', 'Edit Profile | Newber Eats');
  });

  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      console.log(req.body);
      const { operationName } = req.body;
      if (operationName && operationName === 'editProfile') {
        // @ts-ignore
        req.body?.variables?.input?.email = 'legend@test.com';
      }
    });
    user.visit('/edit-profile');
    user.findAllByPlaceholderText(/email/i).clear().type('newLegend@test.com');
    user.findAllByRole('button').click();
  });
});
