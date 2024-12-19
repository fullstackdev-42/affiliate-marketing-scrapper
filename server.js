const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const merchants = require("./routes/api/merchants");
const subaccounts = require("./routes/api/subaccounts");
const profiles = require("./routes/api/profiles");
const home = require("./routes/api/home");
const statistics = require("./routes/api/statistics");
const referrals = require("./routes/api/referrals");
const visits = require("./routes/api/visits");
const payouts = require("./routes/api/payouts");
const app = express();
const crons = require("./controller/crons");

// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
// const db = require("./config/config").localMongoURI;
const db = require("./config/config").mongoURI;

// Connect to Mongo
mongoose
	.connect(db)
	.then(() => console.log("MongoDB connected..."))
	.catch(err => console.log(err));

// Use Routes
app.use("/api/home", home);
app.use("/api/merchants", merchants);
app.use("/api/subaccounts", subaccounts);
app.use("/api/profiles", profiles);
app.use("/api/statistics", statistics);
app.use("/api/referrals", referrals);
app.use("/api/visits", visits);
app.use("/api/payouts", payouts);

//crons.prepareCron();

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server started on port " + port));