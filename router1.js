import { Router } from "express"; 
const router = Router();


router.get('/asta', (req, res) => {
    res.send('Hello World! from router');
})

export default router;
