// routes/books.routes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize')
const {bookSchema, listBooksQuerySchema} = require('../schemas/books.schema')
const bookService = require('../services/books.service')
const validate = require('../middleware/validate')


router.get('/', authenticate, authorize('admin'), validate({ query: listBooksQuerySchema }), (req, res, next) => {
  // your GET /api/v1/books logic
  try {
    const books = bookService.getAllBooks(req.validatedQuery)
    res.json(books)
  } catch (err) {
    next(err)
  }
});

router.get('/:id', authenticate, authorize('admin'), (req, res, next) => {
  try {
    const book = bookService.getBookById(Number(req.params.id));
    res.json(book);
  } catch (err) {
    next(err)
  }
})

router.post('/', authenticate, authorize('admin'), validate({ body: bookSchema }), (req, res, next) => {
  try {
    const newBook = bookService.newBook(req.body)
    res.status(201).json(newBook)
  } catch (err) {
    next(err)
  }
})

router.get('/:bookId/tags', (req, res, next) => {
  try {
    const book = bookService.getBookById(Number(req.params.bookId))
    res.json(book.tags)
  } catch (err) {
    next(err)
  }
})

// app.get('/api/v1/books/:bookId/tags', (req, res) => {
//   const { bookId } = req.params

//   const result = books.find(book => book.id === Number(bookId))

//   if(!result) {
//     return res.status(404).json({'message': 'Book not found'})
//   }

//   res.json(result.tags)
// })

// app.get('/api/v1/books', authenticate, authorize('admin'), (req, res) => {

//   let result = books;

//   if (req.query.author) {
//     result = books.filter(book => book.author.toLowerCase().includes(req.query.author.toLowerCase()))
//   }

//   const filteredBooks = result.map(book => {
//     return {
//       id: book.id,
//       title: book.title,
//       author: book.author
//     }
//   });

//   res.json(filteredBooks)
// })

module.exports = router;