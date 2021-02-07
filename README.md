# [GraphQL Bookshelf API](https://bookshelf-orcin.vercel.app/)

This API delivers data about books from JSON files with an Express/GraphQL server.

View the repository for the React client with Apollo [here](https://github.com/Rachanastasia/graphql-bookshelf-client).

View the live app [here](https://bookshelf-orcin.vercel.app/).

## Tech

- Node.js
- Express.js
- GraphQL
- Deployed with Heroku

## Images

![](/screenshots/menu.jpg)
![](/screenshots/filter-by-author.jpg)

Books can be filtered by author, genre, or rating.

![](/screenshots/also-by.jpg)

When viewing a book, users can see other books by the author. If an author has no other books, books of the same genre are displayed.

## Using the API

The GraphQL Bookshelf API only has one endpoint: `/graphql`.

From this endpoint, users can query for books, genres, and authors. `BookType` has foreign keys to `GenreType` and `AuthorType`. Users can access lists of books from a specified genre or author through the graph. 

All lists of books are filtered by rating, with the highest rated books at the top of the list.

### books

Returns a list of books.

#### books(exclude: 1)

Returns every book except book 1.

The excludes argument can be used in cojunction with `genre` or `rating` arguments.

This is used to exclude the current book in a list of books also by this author

#### book(id: 1)

Queries for single book by id.

#### books(rating: 4)

Queries for all books with a rating of 4 or higher.

### authors

Returns a list of authors.

### author(id: 1)

Returns author with id of 1.

Can get a list of books by the author with specified id.

### genres

Returns a list of genres.

### genre(id: 1)

Returns genre with id of 1.

Can get a list of books from genre of specified id.


## Schema

### BookType

- id
- title
- genre (id points to GenreType)
- published
- rating
- author (id points to AuthorType)

### AuthorType

- id
- firstName
- lastName

### GenreType
- id
- name
