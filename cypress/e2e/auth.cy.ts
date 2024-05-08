const testUser = {
  email: 'test@cypress.com',
  password: '123456',
};

describe('Auth Cycle', () => {
  it('should navigate to the Signup page and register', () => {
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
  });

  it('should navigate to the Home page, logout and login again', () => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('Home');
    cy.get('button[id="logout_button"]').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Login');

    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.get('h1').contains('Home');
  });

  it('should navigate to the Home page, and delete account', () => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('Home');
    cy.get('button[id="delete_account_button"]').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Login');

    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/signin');
    cy.get('h1').contains('Login');
  });
})
