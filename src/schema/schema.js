const graphql = require('graphql');
const books = require('../../books.json');
const authors = require('../../authors.json');
const genres = require('../../genres.json');
const languages = require('../../languages.json');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList } = graphql;


const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    books: {
      args: {
        exclude: { type: GraphQLID },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;
        if (args.limit) {
          const start = args.offset ? args.offset : 0;
          const end = args.limit + start > books.length - 1 ? books.length - 1 : args.limit + start;
          return books
            .filter(b => b.authorId === parent.id && b.id != exclude)
            .slice(start, end)
            .sort((a, b) => a.rating > b.rating ? -1 : 1)
        }
        return books
          .filter(b => b.authorId === parent.id && b.id != exclude)
          .sort((a, b) => a.rating > b.rating ? -1 : 1)

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
        return genres.find(g => g.id == parent.genreId);
      }
    },
    rating: { type: GraphQLInt },
    published: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return authors.find(a => a.id == parent.authorId);

      }
    },
    language: {
      type: LanguageType,
      resolve(parent, args) {
        return languages.find(l => l.id == parent.languageId);
      }
    }
  })
});

const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      args: {
        exclude: { type: GraphQLID },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;
        if (args.limit) {
          const start = args.offset ? args.offset : 0;
          const end = args.limit + start > books.length - 1 ? books.length - 1 : args.limit + start;
          return books
            .filter(b => b.genreId === parent.id && b.id != exclude)
            .slice(start, end)
            .sort((a, b) => a.rating > b.rating ? -1 : 1)
        }
        return books
          .filter(b => b.genreId === parent.id && b.id != exclude)
          .sort((a, b) => a.rating > b.rating ? -1 : 1)
      }
    }
  })
})

const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: () => ({
    id: { type: GraphQLID },
    language: { type: GraphQLString },
    books: {
      args: {
        exclude: { type: GraphQLID },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;
        if (args.limit) {
          const start = args.offset ? args.offset : 0;
          const end = args.limit + start > books.length - 1 ? books.length - 1 : args.limit + start;
          return books
            .filter(b => b.languageId === parent.id && b.id != exclude)
            .slice(start, end)
            .sort((a, b) => a.rating > b.rating ? -1 : 1)
        }
        return books
          .filter(b => b.languageId === parent.id && b.id != exclude)
          .sort((a, b) => a.rating > b.rating ? -1 : 1)
      }
    }
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
        return authors.find(a => a.id == args.id);
      }
    },
    genre: {
      type: GenreType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return genres.find(a => a.id == args.id);
      }
    },
    language: {
      type: LanguageType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return languages.find(a => a.id === args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        rating: { type: GraphQLInt },
        exclude: { type: GraphQLID }
      },
      resolve(parent, args) {
        const exclude = args.exclude ? args.exclude : null;
        if (args && args.limit) {
          const start = args.offset ? args.offset : 0;
          const end = args.limit + start > books.length - 1 ? books.length - 1 : args.limit + start;
          if (args.rating) {
            return books
              .filter(b => b.rating >= args.rating && b.id != exclude)
              .slice(start, end)
              .sort((a, b) => a.rating > b.rating ? -1 : 1);
          }
          return books
            .filter(b => b.id != exclude)
            .slice(start, end)
            .sort((a, b) => a.title > b.title ? 1 : -1);
        }
        else if (args.rating) {
          return books
            .filter(b => b.rating >= args.rating && b.id != exclude)
            .sort((a, b) => a.rating > b.rating ? -1 : 1);
        }
        return books
          .filter(b => b.id != exclude)
          .sort((a, b) => a.title > b.title ? 1 : -1);


      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors.sort((a, b) => a.lastName > b.lastName ? 1 : -1)
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args) {
        return genres.sort((a, b) => a.name > b.name ? 1 : -1);
      }
    },
    languages: {
      type: new GraphQLList(LanguageType),
      resolve(parent, args) {
        return languages.sort((a, b) => a.language > b.language ? 1 : -1);
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery
})