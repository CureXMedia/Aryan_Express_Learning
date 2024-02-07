import express , {json} from 'express'
import { reply } from './gpt.js'  
import morgan from 'morgan' 
import cors from 'cors'
import router from "./router1.js"

import "dotenv/config.js"
const app = express()
const port = 3000

app.use(json())
app.use(morgan('combined'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/reply', async (req, res) => {
    try {
      let {question} = req.body
      if(question === undefined){
        res.status(403).send({"text":"NoQuestion"})
        return
      }
      const reply1 = await reply(question)
      res.status(200).send(reply1)
        
    } catch (error) {
      console.log(error);
      res.status(403).send({"text":"NoQuestion",error})
    }
})
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})