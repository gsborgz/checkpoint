const authTestUser = {
  username: 'testeUserAuth',
  password: 'Test@123',
};

describe('Auth Cycle', () => {
  it('should register a new account and logout', () => {
    cy.visit('http://localhost:3000/signup');

    cy.get('h1').contains('Register');
    cy.get('a[href*="/signin"]').click();
    cy.get('h1').contains('Login');
    cy.url().should('include', '/signin');
    cy.get('a[href*="/signup"]').click();
    cy.url().should('include', '/signup');

    cy.get('input[name="username"]').type(authTestUser.username);
    cy.get('input[name="password"]').type(authTestUser.password);
    cy.get('input[name="password_confirmation"]').type(authTestUser.password);
    cy.get('button[type="submit"]').click();

    cy.get('#avatar-button').click();
    cy.get('a[href="/profile"').click();
    cy.get('#logout-button').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Login');
  });

  it('should login and update theme and language', () => {
    cy.visit('http://localhost:3000/signin');
    cy.get('h1').contains('Login');
    cy.get('input[name="username"]').type(authTestUser.username);
    cy.get('input[name="password"]').type(authTestUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait(500);

    cy.get('#set-language-button').click();
    cy.get('#set-language-ptbr-button').click();
    cy.get('#set-language-button').click();

    cy.get('#avatar-button').click();
    cy.get('#logout-button').should('have.text', 'Sair');
    cy.get('#avatar-button').click();

    cy.get('main').should('have.css', 'background-color', 'rgb(12, 10, 9)');
    cy.get('#set-theme-button').should('have.css', 'color', 'rgb(245, 245, 244)');

    cy.get('#set-theme-button').click();
    cy.get('#set-language-button').click();
    cy.get('#set-language-ptbr-button').click();
    cy.get('#set-language-button').click();

    cy.get('main').should('have.css', 'background-color', 'rgb(245, 245, 244)');
    cy.get('#set-theme-button').should('have.css', 'color', 'rgb(12, 10, 9)');

    cy.get('#avatar-button').click();
    cy.get('#logout-button').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Entrar');

    cy.get('#set-language-button').click();
    cy.get('#set-language-en-button').click();
    cy.get('#set-language-button').click();
    cy.get('h1').contains('Login');

    cy.get('#set-theme-button').click();
    cy.get('main').should('have.css', 'background-color', 'rgb(12, 10, 9)');
    cy.get('#set-theme-button').should('have.css', 'color', 'rgb(245, 245, 244)');
  });

  it('should login and delete account', () => {
    cy.visit('http://localhost:3000/signin');
    cy.get('h1').contains('Login');
    cy.get('input[name="username"]').type(authTestUser.username);
    cy.get('input[name="password"]').type(authTestUser.password);
    cy.get('button[type="submit"]').click();

    cy.get('#avatar-button').click();
    cy.get('a[href="/profile"').click();
    cy.get('#avatar-button').click();
    cy.get('#delete-account-button').click();
    cy.url().should('include', '/signin');
  });
});
