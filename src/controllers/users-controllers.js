const usersModel = require('../models/users-models.js');
const bcript = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const [data]  = await usersModel.getAllUsers();
    res.json({
        message: 'GET semua data users berhasil',
        data: data
            })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error
        })
        
    }
};

const getUser = async (req, res) => {
    const {id} = req.params;
    try {
       const [data] = await usersModel.getUser(id);
        res.json ({
            message: 'GET data User berhasil',
            data: data [0]
        })
    } catch (error) {
       res.status(500).json({
            message: 'Server Error',
            serverMessage: error
        })  
    }
}

const createNewUser = async (req, res) => {
    const {body} = req;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcript.hash(body.password, saltRounds);
        const newUser = {
            ...body, password : hashedPassword
        }

        await usersModel.createNewUser(newUser);

        res.status(201).json({
            message: 'CREATE user baru berhasil',
            data: {
                ...newUser, password: "hashed"
            }
    });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        }) 
    }
   
};

const updateUser = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    try {
        await usersModel.updateUser(body, id);
        res.status(201).json({
        message: 'UPDATE user berhasil',
        data: {
            id: id,
            ...body
        }
    })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error
        })
    }
    
}

const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        await usersModel.deleteUser(id)
        res.json({
        message: 'DELETE user berhasil',
        data: null
    })
    } catch (error) {
        res.status(500).json({
        message: 'Server Error',
        serverMessage: error
        })  
    }
   
}

module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
};