import express from 'express';
import cors from 'cors';
import {PrismaClient} from '@prisma/client';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({error: 'Missing token'});
  try {
    const token = header.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({error: 'Invalid token'});
  }
}

app.get('/api/quizzes', authMiddleware, async (req, res) => {
  const quizzes = await prisma.quizzes.findMany({where: {owner_id: req.user.uid}});
  res.json(quizzes);
});

app.get('/api/quizzes/:id', authMiddleware, async (req, res) => {
  const quiz = await prisma.quizzes.findUnique({where: {quiz_id: req.params.id}});
  res.json(quiz);
});

app.post('/api/quizzes', authMiddleware, async (req, res) => {
  const {title, description, content} = req.body;
  const quiz = await prisma.quizzes.create({data: {title, description, owner_id: req.user.uid, content}});
  res.json(quiz);
});

app.put('/api/quizzes/:id', authMiddleware, async (req, res) => {
  const {title, description, content} = req.body;
  const quiz = await prisma.quizzes.update({where: {quiz_id: req.params.id}, data: {title, description, content}});
  res.json(quiz);
});

app.delete('/api/quizzes/:id', authMiddleware, async (req, res) => {
  await prisma.quizzes.delete({where: {quiz_id: req.params.id}});
  res.json({success: true});
});

app.get('/api/quizzes/:id/export', authMiddleware, async (req, res) => {
  const quiz = await prisma.quizzes.findUnique({where: {quiz_id: req.params.id}});
  res.json(quiz?.content || {});
});

app.post('/api/quizzes/import', authMiddleware, async (req, res) => {
  const {title, description, content} = req.body;
  const quiz = await prisma.quizzes.create({data: {title, description, owner_id: req.user.uid, content}});
  res.json(quiz);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
