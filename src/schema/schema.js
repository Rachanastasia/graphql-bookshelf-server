const graphql = require('graphql');
const books = require('../../books.json');
const authors = require('../../authors.json');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList } = graphql;


const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    books: {
      args: {
        exclude: { type: GraphQLID }
      },
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;

        return exclude
          ? books.filter(b => b.authorId === parent.id && b.id != exclude).sort((a, b) => a.rating > b.rating ? -1 : 1)
          : books.filter(b => b.authorId === parent.id).sort((a, b) => a.rating > b.rating ? -1 : 1);
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
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
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
})

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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return genres.find(g => g.id === args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      args: {
        genre: { type: GraphQLString },
        rating: { type: GraphQLInt },
        exclude: { type: GraphQLID }
      },
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;

        if (args.genre) {
          return books.filter(b => b.genre == args.genre && b.id != exclude).sort((a, b) => a.rating > b.rating ? -1 : 1);
        }

        else if (args.rating) {
          return books.filter(b => b.rating >= args.rating && b.id != exclude).sort((a, b) => a.rating > b.rating ? -1 : 1);
        }

        else {
          return exclude
            ? books.filter(b => b.id != exclude).sort((a, b) => a.rating > b.rating ? -1 : 1)
            : books.sort((a, b) => a.rating > b.rating ? -1 : 1);
        }

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
      resolve(parent, args) {
        let obj = {}
        let arr = []
        books.forEach(b => obj[b.genre] = b.genre);

        let i = 1;
        for (const prop in obj) {
          arr.push({ id: i, name: obj[prop] })
          i++;
        }
        return arr;
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery
})