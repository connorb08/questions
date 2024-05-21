import { AutoRouter } from 'itty-router'
import { GenerateWord, AskQuestion, GetWord } from './gemni';

const router = AutoRouter()

router
    .get("/ai", GenerateWord)
    .post("/ask", AskQuestion)
    .get("/word", GetWord)

router.all('*', () => new Response('Not Found', { status: 404 }));

export default router
