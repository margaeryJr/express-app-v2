const moviesModel = require('../models/movies-models.js');


const getMovies = async (req, res) => {
  try {
    const { search, sort, limit, order } = req.query;

// kirim query params ke model
    const [data] = await moviesModel.getMovies({ search, sort, limit, order });

    res.json({
      message: 'Mencari movie berhasil',
      total: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload.' });
    }

    const fileData = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    };
    res.status(200).json({
      message: 'Upload berhasil!',
      file: fileData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  uploadImage ,
  getMovies
  };