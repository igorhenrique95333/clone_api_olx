import { findAllStates } from "../models/State.js";

export const getStates = async (req,res) => {
    try{
        const states = await findAllStates();
        res.status(200).json({ states });
    }catch (error){
        res
            .status(500)
            .json({ error: "Failed to get states", message: error.message });
    }
};