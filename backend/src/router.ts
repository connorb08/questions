import { AutoRouter } from 'itty-router'
import { GenerateWord, AskQuestion } from './gemni';

const router = AutoRouter()

router
    .get("/ai", GenerateWord)
    .post("/ask", AskQuestion)

router.all('*', () => new Response('Not Found', { status: 404 }));

export default router
