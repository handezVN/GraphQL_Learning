const {books, authors} = require('../data/statics');
const Author = require('../models/Author')
const Book = require('../models/Book')
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
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
            const data =  await context.mongoMethods.createAuthor(args)
            pubsub.publish("NEWAUTHOR", { newAuthor: data  });
           return data
        },
        createBook:async (parent,args,context)=>{
            const data =  await context.mongoMethods.createBook(args)
            pubsub.publish("NEWBOOK", { newBook: data  });
            return data
        },
        deleteBook:async (parent,args,context)=>{
            const result = await context.mongoMethods.deleteBook(args.id)
            console.log(result);
            const msg = "Success";
            return msg
        },
        deleteAuthor:async (parent,args,context)=>{
            const result = await context.mongoMethods.deleteAuthor(args.id)
            console.log(result);
            const msg = "Success";
            return msg
        }
        
    },
    Subscription: {
        newBook: {
          subscribe: () => pubsub.asyncIterator(["NEWBOOK"]),
        },
        newAuthor:{
            subscribe: () => pubsub.asyncIterator(["NEWAUTHOR"]),
        }
      },
    
}
module.exports = resolvers