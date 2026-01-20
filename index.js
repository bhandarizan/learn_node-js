const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(`Hello, ${req.query.name || 'World'}`);
});

app.get('/about', (req, res) => {
    res.send('Hello, This is About Page');
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
}
);