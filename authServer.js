// Auth Server:
// - Handle user authentication (Login, Logout)
// - return token

// Require dotenv to read environment variables from.env file
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/auth");

const app = express();

// If want request body to be parsed as json
app.use(express.json());

// Dummy Database
let users = [
    {
        id: 1,
        username: "Tony MD",
        refreshToken: null,
    },
    {
        id: 2,
        username: "Jane Doe",
        refreshToken: null,
    },
    {
        id: 3,
        username: "Dim Jay",
        refreshToken: null,
    },
];

// Generate access/refresh token function
const generateTokens = (payload) => {
    // Destructuring the user's authentication data to just only take id and username
    const { id, username } = payload;
    // Create JWT
    // Add the property 'expiresIn' to create the expiration time for the access token
    const accessToken = jwt.sign(
        // User's Authentication Data
        { id, username },
        process.env.ACCESS_TOKEN_JWT_SECRET,
        {
            expiresIn: "5m",
        }
    );
    const refreshToken = jwt.sign(
        // User's Authentication Data
        { id, username },
        process.env.REFRESH_TOKEN_JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
    return { accessToken, refreshToken };
};

// Each time after a refresh token has been generated, the user's refresh token is updated
const updateRefreshToken = (username, refreshToken) => {
    users = users.map((user) => {
        if (user.username === username)
            return {
                ...user,
                refreshToken,
            };

        return user;
    });
};

app.post("/login", (req, res) => {
    const { username } = req.body;
    const user = users.find((user) => user.username === username);
    if (!user) {
        return res
            .status(401)
            .json({ message: "Invalid credentials [wrong user info]" });
    }

    const tokens = generateTokens(user);
    updateRefreshToken(user.username, tokens.refreshToken);
    // console.log(users);
    res.json(tokens);
});

// Route to handle re-generate a new access token
app.post("/token", (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res
            .status(401)
            .json({
                message: "Invalid credentials [do not have refresh-token]",
            });

    const user = users.find((user) => user.refreshToken === refreshToken);
    if (!user)
        return res
            .status(403)
            .json({ message: "Invalid credentials [invalid refresh-token]" });

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET);
        const tokens = generateTokens(user);
        updateRefreshToken(user.username, tokens.refreshToken);

        res.json(tokens);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error [something wrong]" });
    }
});

// Route to handle logout => delete the refresh token
// Use the access token in the request header => find user's info in the database
// => delete the refresh token
app.delete("/logout", verifyToken, (req, res) => {
  const user = users.find(user => user.id === req.userId);
  updateRefreshToken(user.username, null);
  // console.log(users);
  res.status(204).json({ message: "Logout successful" });
});

const PORT = process.env.AUTH_PORT || 4000;

app.listen(PORT, () => console.log(`Auth-Server is running on port ${PORT}`));
