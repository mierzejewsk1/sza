require("dotenv").config();

process.env.TZ = "UTC";
const express = require("express");

const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room");
const laundryRoutes = require("./routes/laundry");
const informationRoutes = require("./routes/information");
const exchangeRoutes = require("./routes/exchange");
const faultsRoutes = require("./routes/faults");
const noteRoutes = require("./routes/note");
const visitRoutes = require("./routes/visit");
const imagesRoutes = require("./routes/images")

const cors = require("cors");
const app = express();

const corsOptions = {
  exposedHeaders: "response-header",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/laundry", laundryRoutes)
app.use("/information", informationRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/faults", faultsRoutes);
app.use("/note", noteRoutes);
app.use("/visit", visitRoutes);
app.use("/image", imagesRoutes);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
