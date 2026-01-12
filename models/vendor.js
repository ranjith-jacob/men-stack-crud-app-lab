const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: String,
    isActivelyBlocking: Boolean
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;

