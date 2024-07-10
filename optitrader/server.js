const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy database (replace with your database logic)
let users = [];

// Routes
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if username exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user in database (dummy example)
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in database
    const user = users.find(user => user.username === username);

    // If user doesn't exist
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
