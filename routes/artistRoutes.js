import express from 'express'
import searchArtist from '../controllers/artistController.js'


const router = express.Router()

// Define the routes here
router.post('/search', searchArtist)


export default router