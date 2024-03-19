const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const cronLogSchema = new mongoose.Schema({
    StartTime:{
        type: String
    },
    EndTime:{
        type: String
    }
},{timestamps:true});

module.exports = mongoose.model('CronLog', cronLogSchema);