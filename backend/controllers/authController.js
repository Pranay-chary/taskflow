import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Optimize query: only fetch needed fields for faster response
    let user = await User.findOne({ email: email.toLowerCase() })
      .select('_id name email role password')
      .lean(); // Use lean() for faster queries when we don't need mongoose document methods

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log('Login successful for:', email);
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('Signup attempt for email:', email);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists - optimized query
    const existingUser = await User.findOne({ email: email.toLowerCase() })
      .select('_id')
      .lean();
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // In production, hash this with bcrypt
      role,
    });

    await newUser.save();
    console.log('Signup successful for:', email);

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
