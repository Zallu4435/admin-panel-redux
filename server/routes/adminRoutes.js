const express = require('express');
const Admin = require('../models/adminModel');
const router = express.Router();
const generteToken = require("../utils/generateToken");

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        
      
        const admin = await Admin.findOne({email});

        if(!admin) {            
            return res.status(400).json({message: "Admin doesn't exist"});
        }

        if(admin.password !== password) {            
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        
        const token = await generteToken(admin);
        // console.log(token);


       return res.status(200).json({message:"Login Successful",token});
        


    } catch(err) {
        console.error(err);
        return res.status(500).json({message: err?.message || "Server error"});
    }
});

module.exports = router;



