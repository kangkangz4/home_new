'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// import bcrypt from 'bcrypt-as-promised';
 
const saltRounds = 10;
const ObjectId = mongoose.Schema.Types.ObjectId;

const accountSchema = new mongoose.Schema({
  mobile: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  name: {
    type:String,
    required: true
  },
  pinyin: String,
  email: String,
  age: Number,
  addr: String,
  birth: String,
  sex: Number,
  avatar: String,
  department:{
    type: ObjectId,
    ref: 'Department'
  },
  hashed_pass: {
    type: String,
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.hashed_pass;
      delete ret.created_at;
      delete ret.updated_at;
    }
  }
});

accountSchema.virtual('password')
  .set(function setPassword(value) { this._password = value; })
  .get(function getPassword() { return this._password; });

accountSchema.pre('save', async function preSave(next) {
  if (!this.password) return next();
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    this.hashed_pass = bcrypt.hashSync(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

//重置密码
accountSchema.methods.resetpass = async function(password){
  try{
    this.password = password;
    this.save();
  }catch(error){
    console.log(error);
  }
}

accountSchema.methods.compare = async function(password){
  return bcrypt.compareSync(password, this.hashed_pass);
  // return new Promise((resolve, reject) => {
  //   bcrypt.compare(password, this.hashed_pass).then((res)=>{
  //     resolve(true);
  //   }).catch((error) => {
  //     resolve(false);
  //   });
  // })
};

export default mongoose.model('Account', accountSchema);