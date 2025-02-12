import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const accesToken = req.cookies.accesToken;

        if(!accesToken) {
            return res.status(401).json({message: 'Brak dostępu'});
        }

        try {
            const decoded = jwt.verify(accesToken, process.env.ACCES_TOKEN_SECRET);
            const user = await User.findById(decoded.userid).select('-password');

            if(!user) {
                return res.status(404).json({message: 'Użytkownik nie znaleziony'});
            }

            req.user = user;
            next();
            
        } catch (error) {
            if(error.name === 'TokenExpiredError') {
                return res.status(401).json({message: 'Brak dostępu - token wygasł'});
            }
            throw error;
        } 

    } catch (error) {
        return res.status(401).json({message: 'Brak dostępu - zły token'});
    }
}

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({message: 'Brak dostępu - nie jesteś administratorem'});
    }
}