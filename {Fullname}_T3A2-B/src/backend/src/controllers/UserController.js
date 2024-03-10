const express = require("express");
const {User} = require('../models/UserModel');
const {comparePassword, generateJwt, verifyToken, getUserIdFromToken} = require('../utils/userAuthFunctions')


const router = express.Router();

//required
//header with jwt : jwt
router.get('/favourites', async(request, response) => {
        try {
            const id = getUserIdFromToken(request.headers.jwt);
            
            if (!id) {
                return response.status(401).json({
                    error: 'Invalid or missing token'
                });
        }
        const result = await User.findOne({_id: id})

        if (!result) {
            return response.status(404).json({
                error: 'User not found'
            });
        }
        
        const { favourites } = result.toObject()
        return response.json({
            favourites: favourites || null
        })
    } catch (error) {
        console.error("Error fetching user Favourites", error)
        return response.status(500).json({error: 'internal server error'})
    }
})


router.get("/", async (request, response) =>{
    let result = await User.find();
    response.json({result});
})

//required
//header with jwt : jwt
router.get("/auth-checker", verifyToken, async (request, response) => {
    response.json({message: "you're still authorized"})
});

//required user id passed through params
router.get("/:id", async(request, response) => {
    try{
        let result = await User.findById(request.params.id);
        if(!result){
            return response.status(404).json({message:"User not found"});
        }
        return response.json({result});
    }catch(error){
        return response.status(500).json({message: "Internal server error"});
    }
})

//Add Favourites in 
// {
//     favourite: [updatedFavourites]
// }
router.patch('/favourites', async (request, response) => {

    try {
        const id = getUserIdFromToken(request.headers.jwt);
        if (!id) {
            return response.status(401).json({ error: 'Invalid token' });
        }
        const result = await User.findOneAndUpdate(
            { _id: id },
            { $set: { favourites: request.body.favourite } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ error: 'User not found' });
        }
        const { favourites } = result.toObject()
        return response.json(favourites);
    } catch (error) {
        console.error('Error updating favourites:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
});

// POST
router.post("/create-new-user", async (request, response) =>{

    try {
        let newUser = await User.create({
            fname: request.body.fname,
            lname: request.body.lname,
            email: request.body.email,
            password: request.body.password
        });

        let jwt = generateJwt(newUser._id.toString())
    
        response.status(201).json({
            jwt: jwt,
            message: "Account created successfully"
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

//login route 
/*
{
    "email": "email@email.com",
    "password": "password"
}
*/
router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        
        if (!user) {
            return response.status(403).json({ error: "Invalid email." });
        }
        
        const isPasswordCorrect = await comparePassword(request.body.password, user.password);

        if (!isPasswordCorrect) {
            return response.status(403).json({ error: "Incorrect password, please try again." });
        }
        const auth = user.auth
        const jwt = generateJwt(user._id.toString());

        response.json({ 
            jwt: jwt,
            auth: auth
        });
    } catch (error) {
        console.error("Error during login:", error);
        response.status(500).json({ error: "Internal server error" });
    }
});

router.post("/token-refresh", verifyToken, async (request, response) => {
    
    const refreshToken = generateJwt(request._id.toString())
    //console.log(refreshToken)
    response.json({
        jwt: refreshToken
    })
})


// DELETE method
// Deleting user by ID
// localhost:3000/users/:id
router.delete("/:id", async (request, response) => {
    try {
        const userId = request.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return response.status(404).json({ message: "User not found" });
        }
        
        response.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router
