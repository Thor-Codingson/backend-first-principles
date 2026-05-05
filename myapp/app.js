const express = require('express')
const jwt = require('jsonwebtoken');
//const { use } = require('react');
const app = express()
const port = 3000
const SECRET_KEY = 'super-secret-key-from-env-variable'; // NEVER hardcode in real apps
const { z } = require('zod');

app.use(express.json())

const books = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', tags: ['programming'], created_at: '2024-01-15' },
  { id: 2, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', tags: ['systems', 'databases'], created_at: '2024-02-20' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas', tags: ['programming', 'career'], created_at: '2024-03-10' },
];

const users = [
  { id: 1, email: 'umang@test.com', password: 'password123', role: 'user' },
  { id: 2, email: 'admin@test.com', password: 'admin123', role: 'admin' },
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

function authenticate(req, res, next){
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({error: 'Missing or invalid token'})
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded;
    next()
  } catch(err) {
    return res.status(401).json({error: 'Invalid or expired token'})
  }
}

function authorize(requiredRole){
  return function(req, res, next) {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({error:'Forbidden or Insufficient permission'})
    }
    next();
  };
}

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: result.error.issues.map(issue => ({
           field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    req.body = result.data;
    next();
  }
}

const bookSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().min(1).max(100),
  tags: z.array(z.string().trim()).max(5).optional(),
  published_year: z.number().int().min(1500).max(new Date().getFullYear()).optional()
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/debug', (req, res) => {
  //console.log(req.headers);  // Print EVERYTHING the client sent
  //res.json(req.headers);     // Send it back so you can see it
  console.log('header', req.headers)
  // console.log('params:', req.params);
  // console.log('query:', req.query);
  // console.log('body:', req.body);
  // res.json({ params: req.params, query: req.query, body: req.body });
  res.json({headers: req.headers.authorization})
});

app.get('/public', (req,res) => {
  res.json({message: 'This is public'})
})

app.get('/private', (req, res) => {
  res.json({"message": "This is private"})
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({error: 'Invalid credentials'})
  }

  const token = jwt.sign(
    {userId: user.id, email: user.email, role: user.role},
    SECRET_KEY,
    {expiresIn: '1h'}
  );

  res.json({token})
})


app.post('/user', (req, res) => {

  const {name} = req.body;

  if (!name || name.trim() === '')
    return res.status(400).send({"error": "Name is required"})

  res.status(201).json({created: true});
})

app.get('/api/v1/books', authenticate, authorize('admin'), (req, res) => {

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

app.get('/api/v2/books', authenticate, (req, res) => {

  let result = books;

  if (req.query.author) {
    result = books.filter(book => book.author.toLowerCase().includes(req.query.author.toLowerCase()))
  }

  res.json(result);
})

app.post('/api/v1/books', authenticate, authorize('admin'), validate(bookSchema), (req, res) => {

  // if (!req.body) {
  //   return res.status(400).json({ error: "Request body is missing" });
  // }

  const {title, author, tags} = req.body

  // if (!title || title.trim() === '' || !author || author.trim() === '') {
  //   return res.status(404).send({"error" : "Name or title is required"})
  // }

  const newBook = {
    id: books.length + 1,
    title: title,
    author: author,
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
