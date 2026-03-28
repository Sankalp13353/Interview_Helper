const moongoose = require('mongoose');

const blacklistTokenSchema = new moongoose.Schema({
  token:{
    type:String,
    required:[true,'Token is required to be added in blacklist']
  }
},{timestamps:true})

const tokenBlacklistModel = moongoose.model('blacklistTokens',blacklistTokenSchema);

module.exports = tokenBlacklistModel;

