const jwt = require('jsonwebtoken');


function checkToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Acesso Negado' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não foi fornecido!!!' });
    }

    try {
        
        const decoded = jwt.verify(token, "OurSecret");
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(400).json({ error: 'Token Inválido' });
    }
}

module.exports = checkToken;
