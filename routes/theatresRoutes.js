const Theatre = require("../models/theatresModel");
const router = require("express").Router();
const Show = require("../models/showModel");

router.post("/add", async (req, res) => {
  try {
    const theatre = new Theatre(req.body);
    await theatre.save();
    res.send({
      success: true,
      message: "Theatre Created",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/getAllTheatresByOwnerId/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const theatres = await Theatre.find({ owner: userId });
    res.send({
      success: true,
      message: "Theatres Fetched successfully",
      data: theatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/getAllTheatres", async (req, res) => {
  try {
    const theatres = await Theatre.find().populate("owner");
    res.send({
      success: true,
      message: "Theatres Fetched successfully",
      data: theatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    await Theatre.findByIdAndDelete(req.body.theatreId);
    res.send({
      success: true,
      message: "Theatre Deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/getTheatresByMovieId", async (req, res) => {
  try {
    const { movie, date } = req.body;
    const shows = await Show.find({ date, movie }).populate("theatre");
    //console.log(shows)
    // get the unique theatres
    let uniqueTheatres = [];
    shows.forEach(show =>{
      const theatre = uniqueTheatres.find((theatre) => theatre._id === show.theatre._id)
      if(!theatre){
        const showsForThisTheatre = shows.filter((showObj) => showObj.theatre._id === show.theatre._id);
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows:showsForThisTheatre
        })
      }
    })
    res.send({
      success: true,
      message: "Theatres Fetched successfully",
      data: uniqueTheatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/getShowById", async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate("movie").populate("theatre");
    res.send({
      success:true,
      message:"Show Fetched Successfully",
      data:show
    })
  } catch (error) {
    res.send({
      success:false,
      message:"Something went wrong"
    })
  }
});

router.put("/update", async (req, res) => {
  try {
    await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({
      success: true,
      message: "Theatre Updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

exports.router = router