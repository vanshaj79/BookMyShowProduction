const Show = require("../models/showModel");
const router = require("express").Router();

router.post("/add", async (req, res) => {
  try {
    const theatre = new Show(req.body);
    await theatre.save();
    res.send({
      success: true,
      message: "Show Created",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/getAllShowByTheatreId/:theatreId", async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const shows = await Show.find({ theatre: theatreId }).populate('movie');
    res.send({
      success: true,
      message: "Shows Fetched successfully",
      data: shows,
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
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "Show Deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
    await Show.findByIdAndUpdate(req.body.theatreId, req.body);
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