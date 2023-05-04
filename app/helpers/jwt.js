import appConfig from '../../config/appConfig';
import jwt from 'jsonwebtoken';

const createJWT = async (payload, user, expiresIn) => {
    payload = payload || null;
    user = user || null;
    expiresIn = expiresIn || '24h'; // expires in 24 hours
    if (!payload && !user) {
        throw new Error('Please define payload');
    }
    if (!payload) {
        const role = user.role;
        payload = {
            user:
            {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                role: role ? role.name : null,
            }
        };
    }

    return jwt.sign(payload, appConfig.SECRET, {
        expiresIn: expiresIn
    });
};

const verifyJWT = async (token) => {
    return jwt.verify(token, appConfig.SECRET);
};

const decodeJWT = async (token) => {
    return jwt.decode(token);
};
export default {
    createJWT,
    verifyJWT,
    decodeJWT
};