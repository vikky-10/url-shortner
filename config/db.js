const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect("mongodb+srv://vikky:PmsCsFMpKKiFN3mv@cluster0.gkeu6.mongodb.net/shortly", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected....");
  } catch (e) {
    console.log(e);
    console.log("Refused to Connect");
  }
};
