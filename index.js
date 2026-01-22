const express = require('express');
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

app.get("/users", (req, res) => {
    const html = `
    <ul>
      ${users.map(user => `<li>${user.first_name} </li> `).join('')}
    </ul>
    `;
    res.send(html);
  });


//REST API endpoint 
app.get('/api/users', (req, res) => {
  return res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const id =  parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

app.route('/api/users/:id').get((req, res) => {
 const id =  parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
}).post((req, res) => {
     return res.json({ status : "POST request received" });
}).patch((req, res) => {
    return res.json({ status : "PATCH request received" });
}).delete((req, res) => {
    return res.json({ status : "DELETE request received" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
