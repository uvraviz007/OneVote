const express = require('express')
const router =express.Router();
const User=require('./../models/user.model');

const {jwtAuthMiddleware,generateToken}=require('./../jwt');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        // Check if user with same adharId, email, or mobile exists
        const existingUser = await User.findOne({
            $or: [
                { adharId: data.adharId },
                { email: data.email },
                { mobile: data.mobile }
            ]
        });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this Aadhar number, email, or mobile already exists' });
        }
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        };
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is", token);
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

router.post('/login', async(req, res) => {
    try{
        // Extract aadharCardNumber and password from request body
        const {adharId, password} = req.body;
        console.log('aadharCardNumber:', adharId);
        console.log('password:', password);
        // Check if aadharCardNumber or password is missing
        if (!adharId || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the user by aadharCardNumber
        const user = await User.findOne({adharId});
        console.log('user:', user);
        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid Aadhar Card Number or Password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
     




// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;