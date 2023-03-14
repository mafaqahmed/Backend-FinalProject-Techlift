const jwtoken = require('jsonwebtoken');

const generateToken = (id) => {
    const token = jwtoken.sign(
        {
            id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
    return token;
}

module.exports = {generateToken}