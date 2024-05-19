describe('Status', () => {
  it('should visit /status and see info about the app', () => {
    cy.visit('http://localhost:3000/status');
    cy.get('h1').contains('Status');

    cy.get('#status-updated-at').contains('Updated at');
    cy.get('#status-updated-at-value')
      .invoke('text')
      .then((textDate) => {
        const date = new Date(textDate);
        const parsedUpdatedAt = `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;

        expect(date).to.be.a('Date');
        expect(parsedUpdatedAt).to.be.equal(textDate);
      });

    cy.get('#db-version').contains('Version');
    cy.get('#db-version-value').contains('16.2');

    cy.get('#db-max-connections').contains('Max connections');
    cy.get('#db-max-connections-value').contains('100');

    cy.get('#db-opened-connections').contains('Opened connections');
    cy.get('#db-opened-connections-value').contains('1');
  });
});
