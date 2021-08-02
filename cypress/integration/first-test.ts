describe('First Test', () => {
  it('should go to hompage', () => {
    //types를 cypress로 설정해줬기에 cy변수 사용가능
    cy.visit('http://localhost:3000')
      .title()
      .should('eq', 'Login | Newber Eats');
    //When visiting localhost:3000 title should equal with Login ~~
  });
});
