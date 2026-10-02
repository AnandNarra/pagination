import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.router.js';

export const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

app.use(express.json());

app.use('/api/users/', userRouter)
