const notesTestUser = {
  username: 'testeUserNotes',
  password: 'Test@123',
};
const testText = 'This is a test note';

describe('Notes', () => {
  before(() => {
    cy.visit('http://localhost:3000/signup');
    cy.get('input[name="username"]').type(notesTestUser.username);
    cy.get('input[name="password"]').type(notesTestUser.password);
    cy.get('input[name="password_confirmation"]').type(notesTestUser.password);
    cy.get('button[type="submit"]').click();
  });

  after(() => {
    cy.get('#avatar-button').click();
    cy.get('a[href="/profile"').click();
    cy.get('#avatar-button').click();
    cy.get('#delete-account-button').click();
    cy.url().should('include', '/signin');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
    cy.get('input[name="username"]').type(notesTestUser.username);
    cy.get('input[name="password"]').type(notesTestUser.password);
    cy.get('button[type="submit"]').click();
  });

  it('should succeed on creating a note', () => {
    cy.get('#create-note-button').click();
    cy.get('input[name="note_description"]').type(`${testText}1;`);
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    cy.get('.note-card')
      .invoke('text')
      .then((text) => {
        const textArray = text.split(';').filter((text) => !!text);

        expect(textArray).to.have.lengthOf(1);
        expect(textArray[0]).to.be.equal(`${testText}1`);
      });

    cy.get('#create-note-button').click();
    cy.get('input[name="note_description"]').type(`${testText}2;`);
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    cy.get('.note-card')
      .invoke('text')
      .then((text) => {
        const textArray = text.split(';').filter((text) => !!text);

        expect(textArray).to.have.lengthOf(2);
        expect(textArray[0]).to.be.equal(`${testText}2`);
        expect(textArray[1]).to.be.equal(`${testText}1`);
      });
  });

  it('should succeed on marking a note as favorite', () => {
    cy.get('#favorite-button-1').click();
    cy.wait(1000);
    cy.get('.note-card')
      .invoke('text')
      .then((text) => {
        const textArray = text.split(';').filter((text) => !!text);

        expect(textArray).to.have.lengthOf(2);
        expect(textArray[0]).to.be.equal(`${testText}1`);
        expect(textArray[1]).to.be.equal(`${testText}2`);
      });
  });

  it('should succeed on deleting a note', () => {
    cy.get('#delete-note-button-0').click();
    cy.wait(1000);
    cy.get('.note-card')
      .invoke('text')
      .then((text) => {
        const textArray = text.split(';').filter((text) => !!text);

        expect(textArray).to.have.lengthOf(1);
        expect(textArray[0]).to.be.equal(`${testText}2`);
      });
  });
});
