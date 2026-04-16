const express = require('express')
const app = express()
const port = 3000
app.use(express.json())


const books = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', tags: ['programming'], created_at: '2024-01-15' },
  { id: 2, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', tags: ['systems', 'databases'], created_at: '2024-02-20' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas', tags: ['programming', 'career'], created_at: '2024-03-10' },
];


function corsMiddleware(req, res, next){
  const origin = req.headers.origin;

  const allowedOrigins = ['http://localhost:5173'];

  if (req.path === '/public') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
}

app.use(corsMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/debug', (req, res) => {
  //console.log(req.headers);  // Print EVERYTHING the client sent
  //res.json(req.headers);     // Send it back so you can see it

  console.log('params:', req.params);
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.json({ params: req.params, query: req.query, body: req.body });

});

app.get('/public', (req,res) => {
  res.json({message: 'This is public'})
})

app.get('/private', (req, res) => {
  res.json({"message": "This is private"})
})

app.post('/user', (req, res) => {

  const {name} = req.body;

  if (!name || name.trim() === '')
    return res.status(400).send({"error": "Name is required"})

  res.status(201).json({created: true});
})

app.get('/api/v1/books', (req, res) => {

  let result = books;

  if (req.query.author) {
    result = books.filter(book => book.author.toLowerCase().includes(req.query.author.toLowerCase()))
  }

  const filteredBooks = result.map(book => {
    return {
      id: book.id,
      title: book.title,
      author: book.author
    }
  });

  res.json(filteredBooks)
})

app.get('/api/v2/books', (req, res) => {

  let result = books;

  if (req.query.author) {
    result = books.filter(book => book.author.toLowerCase().includes(req.query.author.toLowerCase()))
  }

  res.json(result);
})

app.post('/api/v1/books', (req, res) => {

  const {title, author, tags} = req.body

  if (!title || title.trim() === '' || !author || author.trim() === '') {
    return res.status(404).send({"error" : "Name or title is required"})
  }

  const newBook = {
    id: books.length + 1,
    title: title.trim(),
    author: author.trim(),
    tags: tags || [],
    created_at: new Date().toISOString()
  };

  books.push(newBook)

  return res.status(201).json(newBook);
})

app.get('/api/debug/types', (req, res) => {
  if (books.length === 0) return res.status(404).json({"error": "No books yet"})

  const book = books[0]

  return res.json({
    id: typeof book.id,
    title: typeof book.title,
    author: typeof book.author,
    tags: Array.isArray(book.tags),
    created_at: typeof book.created_at
  });
});

app.get('/api/v1/books/:id', (req, res) => {

  const { id } = req.params

  const result = books.find(book => book.id === Number(id))

  if(!result) {
    return res.status(404).json({'message': 'Book not found'})
  }

  res.json(result)
})


app.get('/api/v1/books/:bookId/tags', (req, res) => {
  const { bookId } = req.params

  const result = books.find(book => book.id === Number(bookId))

  if(!result) {
    return res.status(404).json({'message': 'Book not found'})
  }

  res.json(result.tags)
})

app.use((req, res) => {
  res.status(404).json({error: "Route not found"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
