const jwt = require('jsonwebtoken')

const token = jwt.sign(
    {userId: 1, role: 'user'},
    'my-secret-key',
    {expiresIn: '1h'}
);

console.log('Token:', token)

const decode = jwt.verify(token, 'my-secret-key');
console.log('Decoded: ', decode);