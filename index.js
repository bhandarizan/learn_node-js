const express = require("express");

const fs = require("fs");
const mongoose = require("mongoose");
const { time } = require("console");
const app = express();
const PORT = 8000;

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/userdb").then(() => {
  console.log("Connected to MongoDB");
})
  .catch((err) => {
    console.log("Mongo Error", err);
  });
  
//Mongoose Schema
const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: false},
  email: {type: String, required: true, unique: true},
  gender: {type: String},
  job_title: {type: String}, 
}, { timestamps: true },);


const User = mongoose.model("user", userSchema);


//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from Middleware 1");
  req.myUserName = "Rizan Bhandari";
  next();
});

app.use((req, res, next) => {
  fs.appendFile(
    "logs.txt",
    `${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    },
  );
});

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
      ${allDbUsers.map((user) => `<li>${user.first_name} - ${user.email}</li> `).join("")}
    </ul>
    `;
  res.send(html);
});

//REST API endpoints
app.get("/api/users", async(req, res) => {
  const allDbUsers =  await User.find({});
  return res.json(allDbUsers);
});



app
  .route("/api/users/:id")
  .get(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
})
  .put(async (req, res) => {
    // Find and update user in MongoDB with all fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        job_title: req.body.job_title,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      status: "Success", 
      user: updatedUser 
    });
  })

   
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { last_name: "changed" });
    return res.json({ statusbar: "Success" });  
  })
   .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ 
      status: "Success",
      message: "User deleted successfully"
    });
  });
  /*.delete((req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete user" });
      }
      res.json({ status: "User deleted successfully" });
    });
  });
  */

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  )
    return res.status(400).json({ error: "All fields are required" });
   const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  });

  
  return res.status(201).json({ msg: "User created successfully" }); 
});

// Assuming you have a model named 'Item' for your database operations

app.route('/items/:id')
    .put((req, res) => {
        // Update an item by ID
        const itemId = req.params.id;
        const updatedData = req.body; // Assuming you're sending JSON data

        Item.findByIdAndUpdate(itemId, updatedData, { new: true })
            .then(updatedItem => {
                if (!updatedItem) {
                    return res.status(404).send('Item not found');
                }
                res.status(200).json(updatedItem);
            })
            .catch(err => res.status(500).send(err));
    })
    .patch(async (req, res) => {
        // Partially update an item by ID
        const itemId = req.params.id;
        const updatedData = req.body; // Assuming you're sending JSON data

        Item.findByIdAndUpdate(itemId, updatedData, { new: true, overwrite: false })
            .then(updatedItem => {
                if (!updatedItem) {
                    return res.status(404).send('Item not found');
                }
                res.status(200).json(updatedItem);
            })
            .catch(err => res.status(500).send(err));
    })
    .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ 
      status: "Success",
      message: "User deleted successfully"
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
