// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseService');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the Supabase DB
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }]);

    if (error) throw error;

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Registration failed.' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user in DB
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error || users.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const user = users[0];

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login successful!' });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Login failed.' });
  }
};

module.exports = { registerUser, loginUser };
