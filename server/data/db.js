const Book = require('../models/Book')
const Author = require('../models/Author')

const mongoDataMethods = {
    getAllBooks: async () =>{
        return await Book.find();
    },
    getBookbyId: async (Id) =>{
        return await Book.findById(Id)
    },
    getAllAuthors: async () =>{
        return await Author.find();
    },
    getAuthorbyId: async (Id) =>{
        return await Author.findById(Id);
    },
    createAuthor: async(args)=> {
        const newAuthor = new Author(args)
        return await newAuthor.save();
    },
    createBook:async (args)=>{
        const newBook = new Book(args)
        return await newBook.save();
    }
}

module.exports = mongoDataMethods;