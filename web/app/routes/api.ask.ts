import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { commitSession, getSession } from "~/utils/session";

export async function action({ request, context }: ActionFunctionArgs) {
    try {
        const method = request.method;
        // Questions worker binding
        const QUESTIONS = context.cloudflare.env.QUESTIONS;
        if (method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }
        const data = await request.json() as { question: string };

        // Handle cookies
        const session = await getSession(request.headers.get("Cookie"));
        const questions = session.get("questions") || [];
        // const d = getMidnightEastern();
        const d = new Date();
        d.setHours(24, 0, 0, 0);

        // Get response from API
        const res = await QUESTIONS.fetch("https://questionsapi.connorbray.net/ask", {
            method: "POST",
            body: JSON.stringify({ question: data.question }),
        });
        const res_data = await res.text();
        console.log(res_data);
        const answer = res_data.replaceAll(".", "").trim().toLowerCase() === "yes";

        // Set cookie data
        session.set("questions", [...questions, { question: data.question, answer }]);

        // Send response
        return new Response(JSON.stringify({
            question: data.question,
            answer
        }), {
            headers: {
                "Set-Cookie": await commitSession(session, { expires: d }),
            },
        })

    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
}