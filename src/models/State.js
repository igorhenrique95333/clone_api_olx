import { prisma } from '../../config/prisma.js';

export const createState = async (name) => {
    return await prisma.state.create({
        data: { name },
    });
};

export const findAllStates = async () =>{
    return await prisma.state.findMany();
};

export const findStateById = async (stateId) =>{
    return await prisma.state.findUnique({
        where: { id: stateId },
    });
};

export const updateState = async (id,data) =>{
    return await prisma.state.update({
        where:{
            id,
        },
        data: {
            name: data.name,
        },
    });
};

export const deleteState = async (id) =>{
    return await prisma.state.delete({
        where:{
            id,
        },
    });
};

export const findStateByName = async(stateName) =>{
    return await prisma.state.findUnique({
        where:{
            name: stateName,
        },
    });
};