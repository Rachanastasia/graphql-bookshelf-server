# GraphQL [Bookshelf API](https://bookshelf-orcin.vercel.app/)

This API delivers data about books from JSON files with an Express/GraphQL server.

View the repository for the React client with Apollo [here](https://github.com/Rachanastasia/graphql-bookshelf-client).

View the live app [here](https://bookshelf-orcin.vercel.app/).

## Tech

- Node.js
- Express.js
- GraphQL
- Deployed with Heroku

## Using the API

The GraphQL Bookshelf API only has one endpoint: `/graphql`.

From this endpoint, users can query for books, as a list or by id, with filters for rating, genre, and author. Users cal also query for a list of authors and genres.

All lists of books are filtered by rating, with the highest rated books at the top of the list.

### books

Returns a list of books.

#### books(exclude: 1)

Returns every book except book 1.

The excludes argument can be used in cojunction with `genre` or `rating` arguments.

#### books(genre:"Fiction")

Queries for all books of genre Fiction.

#### books(authorId: 1)

Queries for all books by author 1.

#### books(rating: 4)

Queries for all books with a rating of 4 or higher.

### authors

Returns a list of authors.

### genres

Returns a list of genres.

Note: Genres cannot be queried individually by id.

### book(id: 1)

Returns book with id of 1.

### author(id: 1)

Returns author with id of 1.

## Schema

### book

- id
- title
- genre
- published
- rating

### author

- id
- firstName
- lastName
