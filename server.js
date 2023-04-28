// Require dotenv to read environment variables from.env file
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/auth");
const app = express();

// If want request body to be parsed as json
app.use(express.json());

// Dummy Database
const posts = [
    {
        userId: 1,
        post: "Tony MD - post",
    },
    {
        userId: 1,
        post: "Tony MD - post 1",
    },
    {
        userId: 1,
        post: "Tony MD - post 2",
    },
    {
        userId: 2,
        post: "Jane Doe - post",
    },
    {
        userId: 3,
        post: "Dim Jay - post",
    },
];

// Using middleware to verify token
app.get("/posts", verifyToken, (req, res) => {
    res.json(posts.filter((post) => post.userId === req.userId));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
