import { redis } from '../library/redis.js';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (userid) => {
    const accesToken = jwt.sign({userid}, process.env.ACCES_TOKEN_SECRET, {expiresIn: '15m'});

    const refreshToken = jwt.sign({userid}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

    return {accesToken, refreshToken};
}

const storeRefreshToken = async (userid, refreshToken) => {
    await redis.set(`refreshToken:${userid}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}

const setCookies = (res, accesToken, refreshToken) => {
    res.cookie('accesToken', accesToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameStie: "strict", 
        maxAge: 15 * 60 * 1000,
    })
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
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
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})

        if (user && (await user.comparePassword(password))) {
            const {accesToken, refreshToken} = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);

            setCookies(res, accesToken, refreshToken);

            res.json({user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, message: 'Zalogowano'});
        } else {
            res.status(401).json({message: 'Nieprawidłowy email lub hasło'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    // res.send('Proba zalogowania wywołana');
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshToken:${decoded.userid}`);
        }

        res.clearCookie('accesToken');
        res.clearCookie('refreshToken');
        res.json({message: 'Wylogowano'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const refresh_token = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(403).json({message: 'Brak tokena odświeżenia'});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedRefreshToken = await redis.get(`refreshToken:${decoded.userid}`);

        if(storedRefreshToken !== refreshToken) {
            return res.status(403).json({message: 'Nieprawidłowy token odświeżenia'});
        }

        const accesToken = jwt.sign({userid: decoded.userid}, process.env.ACCES_TOKEN_SECRET, {expiresIn: '15m'});
        
        res.cookie("accesToken", accesToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })

        res.json({message: 'Token odświeżenia odnowiony'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// export const getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id).select('-password');
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }