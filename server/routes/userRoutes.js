// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs'); 
const User = require('../models/userModel');
const router = express.Router();
const generateToken = require('../utils/generateToken');
const verifyToken = require('../utils/verifyToken');
const upload = require('../utils/multer');
const mongoose = require('mongoose');



router.post('/register', upload.single('file'), async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      file: req.file ? req.file.path : null, 
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});





// User login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = await generateToken(user);
    return res.status(200).json({message: "Login Successful", token});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




// Users Router
router.get('/users', async (req, res) => {
  
  try {
    const users = await User.find();     
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

module.exports = router;




// Profile Route with Jwt verification middleware

router.get('/status', verifyToken, async (req, res) => {
  
  try {
    const user = await User.findById(req.userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone, 
      file: user.file,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// Get User Profile Route
router.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;    

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});






// Profile Edit Route 

router.put('/profile/:id', upload.single('profile'), verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, phone } = req.body;

  try {
    const updatedFields = { username, email, phone };

    if (req.file) {
      updatedFields.file = req.file.fieldname;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});




// router.put('/update', upload.single('profile'), verifyToken, async (req, res) => {
//   // const { id } = req.params;
//   const { username, email, phone, password } = req.body;

//   console.log(username, email, phone, password,'hiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
  

//   try {
//     const updatedFields = { username, email, phone, password };

//     if (req.file) {
//       updatedFields.file = req.file.fieldname;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { $set: updatedFields },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).send('User not found');
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });





// Delete user route
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findById(userId); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;