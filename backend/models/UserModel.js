const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{type: String, required:true, unique: true},
    password:{type: String, required:true},//hashed
    name:{type: String,required:true },
    phone:{type:String,required:true, unique: true},
    isAdmin: {type: Boolean, default:false, required:true},
    isSuperAdmin: {type: Boolean, default:false},
    childrenIDs: {type: [mongoose.Types.ObjectId]},
    parentID: {type:mongoose.Types.ObjectId},
    assignDevices:{type:[{deviceType:Number, deviceID:Number}]},
});

module.exports = mongoose.model("User", UserSchema);