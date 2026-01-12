const express = require("express");
const morgan = require("morgan");
const methodOverride = require ("method-override");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Vendor = require("./models/vendor.js");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

app.get("/", async (req, res) => {
    res.render("index.ejs");
})

app.get("/vendors", async (req, res) => {
    const allVendors = await Vendor.find();
    console.log("Show all vendors please", allVendors);
    res.render("vendors/index.ejs", { vendors: allVendors });
});

app.get("/vendors/new", (req, res) => {
    res.render("vendors/new.ejs");
})

app.get("/vendors/:vendorId", async (req, res) => {
    const foundVendor = await Vendor.findById(req.params.vendorId);
    console.log("found vendor", foundVendor);
    res.render("vendors/show.ejs", { vendor: foundVendor});
})

app.delete("/vendors/:vendorId", async (req, res) => {
    await Vendor.findByIdAndDelete(req.params.vendorId);
    res.redirect("/vendors");
})

app.put("/vendors/:vendorId", async (req, res) => {
    if (req.body.isActivelyBlocking === "on") {
        req.body.isActivelyBlocking = true;
    } else {
        req.body.isActivelyBlocking = false;
    }
    await Vendor.findByIdAndUpdate(req.params.vendorId, req.body);
    res.redirect(`/vendors/${req.params.vendorId}`);
})

app.post("/vendors", async (req, res) => {
    if (req.body.isActivelyBlocking === "on") {
        req.body.isActivelyBlocking = true;
    } else {
        req.body.isActivelyBlocking = false;
    }
    console.log(req.body);
    await Vendor.create(req.body);
    console.log("Create request:",Vendor);
    res.redirect("/vendors");
})

app.get("/vendors/:vendorId/edit", async (req, res) => {
    const foundVendor = await Vendor.findById(req.params.vendorId);
    console.log("found vendor for edit", foundVendor);
    res.render("vendors/edit.ejs", {
        vendor: foundVendor,
    })
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})

