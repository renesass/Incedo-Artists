import express from 'express'
import bodyParser from 'body-parser';

// Middlewares
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

// Routers
import artistRouter from './routes/artistRoutes.js';

import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/artists', artistRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}.`);
});