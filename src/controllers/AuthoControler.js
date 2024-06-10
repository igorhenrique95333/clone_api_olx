import bcrypt from 'bcrypt';
import { findStateByName } from '../models/State.js';
import { findUserByEmail } from '../models/User.js';



export const sigunp = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (user) {
            res.status(500).json({
                error: "Error already exists!"
            });
            return;
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10)
        const stateId = await findStateByName(data.state);
        await createUser({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
        }, stateId.id);
        res.status(201).json({ token }); 
        console.log(passwordHash)
    } catch (error) {
        res.status(500).json({error:'Failed to create user', message: error.message})
    }
};

export const signin = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if(!user){
            res.status(500).json({ error: 'Email or password invalid!' })
            return;
        }

        const match = await bcrypt.compare(data.passowrd, user.passowrdHash)
        if(!match){
            res.status(500).json({ error: 'Email or password invalid!' })
            return;
        }
        console.log(match)
    } catch (error) {
     res.status(500).json({error: 'Failed to log in', message: error.message})   
    }
}