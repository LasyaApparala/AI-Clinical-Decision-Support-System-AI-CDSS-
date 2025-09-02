import mongoose from 'mongoose'
const uri = process.env.MONGO_URI
mongoose.connect(uri, { dbName: 'medassist' })
  .then(()=> console.log('Mongo connected'))
  .catch(err => { console.error('Mongo error', err); process.exit(1) })
