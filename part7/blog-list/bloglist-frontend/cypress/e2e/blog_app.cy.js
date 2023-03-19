describe('Blog app', () => {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    let user = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    user = {
      name: 'Superuser2',
      username: 'root2',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.get('#username-input')
    cy.get('#password-input')
    cy.get('#login-button')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username-input').type('root')
      cy.get('#password-input').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username-input').type('root')
      cy.get('#password-input').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('body').should('not.contain', 'Superuser logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('title by cypress')
      cy.get('#author-input').type('author by cypress')
      cy.get('#url-input').type('url by cypress')
      cy.get('#blog-submit-button').click()

      cy.get('body').should('contain', 'title by cypress author by cypress')
      cy.get('body').should('not.contain', 'url by cypress')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another title by cypress',
          author: 'another author by cypress',
          url: 'another url by cypress',
        })
      })

      it('It can be liked', function () {
        cy.get('.blog').eq(0).as('theBlog')
        cy.get('@theBlog').get('button[name="more"]').click()
        cy.get('@theBlog').should('contain', 'like 0')
        cy.get('@theBlog').get('button[name="like"]').as('theLikeButton')
        cy.get('@theLikeButton').click()
        cy.get('@theBlog').should('contain', 'like 1')
        cy.get('@theLikeButton').click()
        cy.get('@theBlog').should('contain', 'likes 2')
      })

      it.only('It can be deleted by valid user', function () {
        cy.get('.blog').as('theBlog')
        cy.get('@theBlog').get('button[name="more"]').click()
        cy.get('@theBlog').get('button[name="delete"]').click()
        cy.get('@theBlog').should('not.exist')
      })

      describe('And login as other user', function () {
        beforeEach(function () {
          cy.logout()
          cy.login({ username: 'root2', password: 'salainen' })
        })

        it('It cannot be deleted', function () {
          cy.get('.blog').as('theBlog')
          cy.get('@theBlog').get('button[name="more"]').click()
          cy.get('@theBlog').should('not.contain', 'delete')
        })
      })
    })

    describe('And multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'Superuser',
          url: 'url1',
          likes: 20
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'Superuser',
          url: 'url2',
          likes: 10
        })
        cy.createBlog({
          title: 'The title with the third most likes',
          author: 'Superuser',
          url: 'url3',
          likes: 9
        })
      })

      it('They are sorted descendingly by likes', function () {
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the third most likes')
      })

      it('They are still sorted after updating the likes', function () {
        cy.get('button[name="more"]').eq(2).click()
        cy.get('button[name="like"]').as('theLikeButton')
        cy.get('@theLikeButton').click()
        cy.get('.blog').contains('likes 10')
        cy.get('@theLikeButton').click()
        cy.get('.blog').contains('likes 11')
        cy.get('@theLikeButton').click()
        cy.get('.blog').contains('likes 12')
        cy.get('@theLikeButton').click()
        cy.get('.blog').contains('likes 13')
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the third most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the second most likes')
      })
    })
  })
})