import bcrypt from 'bcrypt';
import { findUserByEmail } from '../models/User.js';
import { findStateByName } from '../models/State.js';
import { createUser } from '../models/User.js';
import { updateToken, findUserByTokenWithRelations } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const signup = async (req,res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if(user){
            res.status(500).json({
                error: "Email already exists!",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);
        const stateId = await findStateByName(data.state);

        await createUser({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
        },stateId.id);
        res.status(201).json({ token });
    } catch (error) {
     res
        .status(500)   
        .json({ error: "Failed to create user", message: error.message });
    }
};

export const signinv2 = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (!user) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const match = await bcrypt.compare(data.password, user.passwordHash)
        if (!match) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, 'senha', { expiresIn: '1h' });

        await updateToken(user.id, token);
        res.status(200).json({ userId: user.id, token });

    } catch (error) {
        res.status(500).json({ error: "Failed to log in", message: error.message });
    }
};


export const signin = async (req,res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if(!user){
            res.status(500).json({
                error: "Email or password invalid!",
            });
            return;
        }

        const match = await bcrypt.compare(data.password, user.passwordHash)
        if(!match){
            res.status(500).json({
                error: "Email or password invalid!",
            });
            return;
        }
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);
        await updateToken(user.id, token);
        res.status(200).json({ userId: user.id, token});

    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to log in", message: error.message });
    }
};

export const info = async (req,res) => {
    try {
        let token = req.body.token;
        const user = await findUserByTokenWithRelations(token);
        let adList = [];
        res.status(200).json({
            name: user.name,
            email: user.email,
            state: user.state.name,
            ads: adList,
        });

    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to get info of the user", message: error.message });

    }
}