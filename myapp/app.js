const express = require('express')
const app = express()
const port = 3000
app.use(express.json())


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
  console.log(req.headers);  // Print EVERYTHING the client sent
  res.json(req.headers);     // Send it back so you can see it
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
