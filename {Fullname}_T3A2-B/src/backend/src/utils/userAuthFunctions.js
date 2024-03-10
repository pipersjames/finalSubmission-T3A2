const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//password checker
async function comparePassword(plainTextPassword, hashedPassword){
    let doesPasswordMatch = false
    doesPasswordMatch = await bcrypt.compare(plainTextPassword, hashedPassword)
    return doesPasswordMatch
}

//make jwt
function generateJwt(userId) {
    let newJwt = jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET || 'test-key',
        {expiresIn: "3d"}
    )

    return newJwt
}

//extract userID from jwt
function getUserIdFromToken(token) {
    try {
        if (!token) {
            console.error('Token is missing')
            return null
        }
        const decodedToken = jwt.decode(token);
        
        if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.userId) {
            console.error('Invalid token format');
            return null
        }

        return decodedToken.userId;
    } catch (error) {
        console.error('Error decoding or extracting token:', error);
        return null;
    }
}

//middleware to verify JWT
function verifyToken(request, response, next) {
    
    const token = request.headers.jwt

    if (!token) {
        return response.status(401).json({error: "Unauthorized"})
    }

    jwt.verify(token, process.env.JWT_SECRET || 'test-key', (error, decoded) => {
        if (error) {
            return response.status(403).json({ error: 'Invalid token'})
        }

        request._id = decoded
        //console.log(request._id)
        next()
    })
}

module.exports = {
    comparePassword,
    generateJwt,
    verifyToken,
    getUserIdFromToken
}