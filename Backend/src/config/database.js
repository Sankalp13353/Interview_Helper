const moongoose = require('mongoose');


async function connectToDB(){
  try{await moongoose.connect(process.env.MONGO_URI)
  console.log('Connected to database')
  }catch(err){
    console.log('Error connecting to database', err)
  }
}

module.exports = connectToDB;
