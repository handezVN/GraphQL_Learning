const {books, authors} = require('../data/statics');
const Author = require('../models/Author')
const Book = require('../models/Book')

const resolvers = { 
    // Query
    Query: {
    books: async (parent,args,context) =>  {
         return await context.mongoMethods.getAllBooks()
    },
    authors: async (parent,args,context) => {
        return await context.mongoMethods.getAllAuthors()
    },
    book:async (parent,args,context) => await context.mongoMethods.getBookbyId(args.id),
    author : async(parent,args,context)  => await context.mongoMethods.getAuthorbyId(args.id),
    },
    Book:{
        author: async ({authorId},args,context)  =>{
            return await context.mongoMethods.getAuthorbyId(authorId)
        }
    },
    Author:{
        books: async(parent,args,context) =>{
           
            const data =  await context.mongoMethods.getAllBooks();

            return data.filter(book => book.authorId == parent.id)
        }
    },
    // Mutation
    Mutation:{
        createAuthor: async(parent,args,context)=> {
           return await context.mongoMethods.createAuthor(args)
        },
        createBook:async (parent,args,context)=>{
            return await context.mongoMethods.createBook(args)
        }
    }
}
module.exports = resolvers