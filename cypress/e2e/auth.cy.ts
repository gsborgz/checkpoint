const testUser = {
  email: 'test@cypress.com',
  password: '123456',
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

    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="password_confirmation"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.get('h1').contains('Home');
    cy.get('button[id="logout-button"]').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Login');
  });

  it('should login and update theme and language', () => {
    cy.visit('http://localhost:3000/signin');
    cy.get('h1').contains('Login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.get('h1').contains('Home');

    cy.get('button[id="set-language-ptbr-button"]').click();
    cy.get('h1').contains('Início');

    cy.get('main').should('have.css', 'background-color', 'rgb(12, 10, 9)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'color', 'rgb(245, 245, 244)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'border-color', 'rgb(245, 245, 244)');
    cy.get('button[id="set-theme-button"]').click();
    cy.get('main').should('have.css', 'background-color', 'rgb(245, 245, 244)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'color', 'rgb(12, 10, 9)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'border-color', 'rgb(12, 10, 9)');

    cy.get('button[id="logout-button"]').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Entrar');

    cy.get('button[id="set-language-en-button"]').click();
    cy.get('h1').contains('Login');

    cy.get('button[id="set-theme-button"]').click();
    cy.get('main').should('have.css', 'background-color', 'rgb(12, 10, 9)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'color', 'rgb(245, 245, 244)');
    cy.get('button[id="set-language-ptbr-button"]').should('have.css', 'border-color', 'rgb(245, 245, 244)');
  });

  it('should login and delete account', () => {
    cy.visit('http://localhost:3000/signin');
    cy.get('h1').contains('Login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.get('h1').contains('Home');

    cy.get('button[id="delete-account-button"]').click();
    cy.url().should('include', '/signin');
  });
})
