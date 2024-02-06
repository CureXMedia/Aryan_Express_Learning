import express , {json} from 'express'
import { reply } from './gpt.js'   
import "dotenv/config.js"
const app = express()
const port = 3000

app.use(json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/reply', async (req, res) => {
    try {
      if (req.query.question === undefined) {
        
        throw new Error("NoQuestion")
      }
      console.log(req.query.question);
        const reply1 = await reply(req.query.question)
        res.status(200).send(reply1?.text)
        
    } catch (error) {
        
        res.status(404).send("NoQuestion"+error)
    }
})
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})