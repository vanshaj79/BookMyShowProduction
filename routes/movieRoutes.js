const router = require("express").Router();
const Movie = require("../models/movieModels");

router.post("/add", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.send({
      success: true,
      message: "Movie Created",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/getAllMovies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send({
      success: true,
      message: "Movies Fetched Successfully",
      data: movies,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.get("/getMovieById/:movieId", async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findOne({ _id: movieId });
    res.send({
      success: true,
      message: "Movie Fetched Successfully",
      data: movie,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.put("/updateMovie", async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Movies Updated Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

router.post("/deleteMovie", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Movies Deleted Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

exports.router = router;
