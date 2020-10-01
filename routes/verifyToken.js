const jwt = require('jsonwebtoken')

const verify = (req, res, next) =>{
    const token = req.header('auth-token')

    if (token) {
        const verified = jwt.verify(token, "hellodfhzthhzhworld")
        
        if (verified) {
            req.user = verified;
            next();
        } else {
            res.send('invalid')
        }
        
    } else {
        res.send('access denied')
    }
}

module.exports = verify