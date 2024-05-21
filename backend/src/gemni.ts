import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GenerateWord(request: Request, env: Env) {

    try {
        const KV = env.KV;
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = "Give me a random noun for a game of 20 questions.";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const word = text.replaceAll("*", "").trim().toLowerCase();
        const put_result = await KV.put("todays-word", word);

        return new Response("OK!");
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 })
    }

}

export async function AskQuestion(request: Request, env: Env) {
    try {
        const body = await request.json() as { question: string };
        const question = body.question;
        const KV = env.KV;
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const word = await KV.get("todays-word");
        const prompt = `20 questions, the word is "${word}". The question is: "${question}" ? Answer only using yes or no.`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim().toLowerCase();
        return new Response(text);
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 })
    }
}

export async function GetWord(request: Request, env: Env) {
    try {
        const KV = env.KV;
        const word = await KV.get("todays-word");
        return new Response(word);
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 })
    }
}