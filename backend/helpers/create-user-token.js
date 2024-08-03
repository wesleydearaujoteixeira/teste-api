const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
    name: user.name,
    id: user._id,
}, "OurSecret", );

// restart 

res.json({
    message: 'Your token has been automatically generated',
    token,
    userId: user._id,

});

}

module.exports = createUserToken