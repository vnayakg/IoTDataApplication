const mongoose = require('mongoose')

const dataPointSchema = new mongoose.Schema({
    dateTime: {type: Date, required:true},
    deviceType: {type: Number, required:true},
    deviceID: {type: Number, required:true},
    noOfSensors: {type: Number, required:true},
    sensorType: {type: Number, required:true},
    sensorID: {type: Number, required:true},
    values: {type:Array, required:true},
})

const sensorSchema = new mongoose.Schema({
    sensorType:{type: Number, required:true},
    description:{type: String},
    sensorIDsInUse: {type: Number, required:true},
    valueNames: {type: [String], required: true},

})

const deviceSchema = new mongoose.Schema({
    deviceType:{type: Number, required:true },
    description: {type: String, required:true},
    deviceIDsInUse: {type: Number, required:true}
})

const userSchema = new mongoose.Schema({
    username:{type: String, required:true, unique: true},
    password:{type: String, required:true},//hashed
    name:{type: String,required:true },
    phone:{type:String,required:true, unique: true},
    isAdmin: {type: Boolean, default:false, required:true},
    isSuperAdmin: {type: Boolean, default:false},
    childrenIDs: {type: [mongoose.Types.ObjectId]},
    parentID: {type:mongoose.Types.ObjectId, required:true},
    assignDevices:{type:[{deviceType:Number, deviceID:Number}]},

})

// add new user
// remove user
// access of device or only particular senosr
