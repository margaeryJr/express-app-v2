const usersModel = require('../models/users-models.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Masukkan username/email dan password' });
    console.log('Percobaan login di user:', username);

    const [rows] = await usersModel.getUserByName(username);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Password salah' });

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.json({ message: 'Login berhasil', token });
    } catch (error) {
     res.status(500).json({ message: 'Server error', serverMessage: err.message });  
    }
}

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
  try {
    const { id } = req.params;
    const [rows] = await usersModel.getUser(id);
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'GET data User berhasil', data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', serverMessage: error.message });
  }
};

const createNewUser = async (req, res) => {
    const {body} = req;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

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

module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    loginUser
};