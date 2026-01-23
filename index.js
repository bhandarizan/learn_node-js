const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require('fs');

const app = express();
const PORT = 8000;

//Middleware 
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
console.log("Hello from Middleware 1");
req.myUserName = "Rizan Bhandari";  
next();
});

app.use((req, res, next) => {
fs.appendFile('logs.txt', `${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`, (err, data) => {
  next();
});
});


app.get("/users", (req, res) => {
    const html = `
    <ul>
      ${users.map(user => `<li>${user.first_name} </li> `).join('')}
    </ul>
    `;
    res.send(html);
  });


//REST API endpoints
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
}).put((req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title
  };

  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), () => {
    res.json({
      status: "User fully replaced",
      user: users[userIndex]
    });
  });
}).patch((req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = { ...users[userIndex], ...body };

  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), () => {
    res.json({
      status: "User partially updated",
      user: users[userIndex]
    });
  });
}).delete((req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);  
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users.splice(userIndex, 1);

 fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
  if (err) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
  res.json({ status: "User deleted successfully" });
});

});

app.post('/api/users', (req, res) => {
  const body = req.body;
  users.push({...body, id: users.length + 1});
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
  return res.json({ status : "User added successfully", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
