const { v4 : uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/users-models.js');


const rootEndpoint = (req, res) => {
  try {
    res.json({
    message: 'Welcome to Movies API',
    endpoints: {
      users: '/users',
      movies: '/movies'
    } });
  } catch (error) {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
  }
};

const loginUser = async (req, res) => {
    try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Masukkan username/email dan password' });
    console.log('Percobaan login di user:', username);

    const [rows] = await usersModel.getUserByName(username);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ 
        message: 'User tidak ditemukan' });
    }
    if (user.is_verified === 0) {
      return res.status(403).json({ 
        message: 'Email belum diverifikasi. Silakan cek email Anda.' 
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.json({ 
      message: 'Login berhasil', token, user:{
        id: user.id,
        username: user.username,
        email: user.email
      } 
    });
    } catch (error) {
     res.status(500).json({ message: 'Server error', serverMessage: error.message });  
    }
};

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
    try {
      const { fullname, username, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verifyToken = uuidv4();
        const newUser = {
          fullname,
          username,
          email,
          password: hashedPassword,
          verify_token: verifyToken,
          is_verified: 0
        };

        await usersModel.createNewUser(newUser);

// controller kirim email verifikasi
    const verifyLink = `${process.env.APP_URL}/users/verify?token=${verifyToken}`;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });
    
    console.log('Mengirim email verifikasi ke:', email);

    await transporter.sendMail({
      from: `"Movies App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifikasi Akun Movies App Anda',
      html: `
        <h3>Halo ${fullname},</h3>
        <p>Terima kasih telah mendaftar. Klik tautan di bawah ini untuk verifikasi akun Anda:</p>
        <a href="${verifyLink}"> Verifikasi Akun </a>
        <p>Token ini hanya berlaku satu kali.</p>
      `
    });

    console.log('Email berhasil dikirim ke:', email);

    res.status(201).json({ message: 'User dibuat, silakan cek email untuk verifikasi akun.' });
  } catch (error) {
    console.error ('Error saat create user:', error);
    res.status(500).json({ message: 'Server Error', serverMessage: error.message });
  }
};

// Controller verifikasi email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const [rows] = await usersModel.findUserByVerifyToken(token);

    if (!rows[0]) {
      return res.status(400).send('<h3>Token tidak valid atau sudah digunakan.</h3>');
    }

    await usersModel.verifyUser(rows[0].id);

    console.log('User berhasil diverifikasi:', rows[0].email);
    
    res.send('<h3>Verifikasi berhasil! Akun Anda sudah aktif!</h3>');
  } catch (error) {
    console.error('Error saat verifikasi:', error);
    res.status(500).send('<h3>Server error.</h3>');
  }
};


module.exports = {
  rootEndpoint,
    createNewUser,
    verifyEmail,
    getAllUsers,
    getUser,
    loginUser
};