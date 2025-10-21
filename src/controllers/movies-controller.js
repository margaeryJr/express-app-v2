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

module.exports = {
  getMovies
};
