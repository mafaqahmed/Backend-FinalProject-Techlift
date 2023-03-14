const jwtoken = require('jsonwebtoken');

const generateRefreshToken = (id) => {
    const token = jwtoken.sign(
        {
            id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
    return token;
}

module.exports = {generateRefreshToken}