import { redis } from '../library/redis.js';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (userid) => {
    const accesToken = jwt.sign({userid}, process.env.ACCES_TOKEN_SECRET, {expiresIn: '15m'});

    const refreshToken = jwt.sign({userid}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

    return {accesToken, refreshToken};
}

const storeRefreshToken = async (userid, refreshToken) => {
    await redis.set(`refreshToken: ${userid}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}

const setCookies = (res, accesToken, refreshToken) => {
    res.cookie('accesToken', accesToken, {
        httpOnly: true,
        secoure:process.env.NODE_ENV === 'production',
        sameStie: "strict", 
        maxAge: 15 * 60 * 1000,
    })
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secoure:process.env.NODE_ENV === 'production',
        sameStie: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export const signup = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({message: 'Użytkownik już istnieje'});
        }
    
        const user = await User.create({
            name,
            email,
            password
        });
    
        const {accesToken, refreshToken} = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accesToken, refreshToken);

        res.status(201).json({user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
        }, message: 'Użytkownik zarejestrowany'});        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
    
    // res.send('Proba zarejestrowania wywołana');
}

export const login = (req, res) => {
    res.send('Proba zalogowania wywołana');
}

export const logout = (req, res) => {
    res.send('Proba wylogownia wywołana');
}