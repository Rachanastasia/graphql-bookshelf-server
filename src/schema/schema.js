const graphql = require('graphql');
const books = require('../../books.json');
const authors = require('../../authors.json');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

//Schema file should:
//define type
//define relationships between types
//define root queries
//Root queries are how a user can grab data
const genres = [
  {id: 1, title:'Fiction'},
  {id: 2, title:'Short Stories'},
  {id: 3, title:'Poetry'},
  {id: 4, title:'Non-fiction'},
  {id: 5, title:'Philosophy'},
  {id: 6, title:'Writing'},
  {id: 7, title: 'Classics'}
]

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books.filter(b => b.authorId === parent.id);
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { 
      type: GenreType,
    resolve(parent, args) {
      return genres.find(g => g.id === parent.genre);
    } },
    rating: { type: GraphQLInt },
    published: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return authors.find(a => a.id == parent.authorId);
      }
    }
  })
});

const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books.filter(b => b.genre === parent.id)
      }
    }
  })
})

//get all books from genre
//get all books with minimum rating


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //get data from database or other source
        return books.find(b => b.id == args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authors.find(a => a.id === args.id);
      }
    },
    genre: {
      type: GenreType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return genres.find(g => g.id === args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books.sort((a, b) => a.rating > b.rating ? -1 : 1);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args){
        return genres;
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery
})