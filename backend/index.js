import express , {json} from 'express'
import { reply , pipe } from './gpt.js'  
import morgan from 'morgan' 
import cors from 'cors'
// import mongoose from 'mongoose';
import { MONGODB_URI } from "./config.js";
// const mongodburi = MONGODB_URI;
// import {userRouter} from './routes/userRoutes.js'

import path from "path"

import "dotenv/config.js"
const app = express()
const port = 3000


app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

// app.use('/users' , userRouter)

// mongoose.connect(mongodburi)
// .then(()=>{
//   app.listen(port, () => {
//     console.log(`Server listening on port http://localhost:${port}`)
//   })
// })
// .catch(err => console.error(err))




app.post('/pipe', async (req, res) => {
  try {
    let {question} = req.body
    if(question === undefined){
      res.status(403).send({"text":"NoQuestion"})
      return
    }
    const reply1 = await pipe(question)
    res.status(200).send(reply1)
      
  } catch (error) {
    console.log(error);
    res.status(403).send({"text":"NoQuestion",error})
  }
})


app.use('/', express.static('../frontend/dist'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
})



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})