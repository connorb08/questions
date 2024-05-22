import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { commitSession, getSession } from "~/utils/session";

export async function action({ request, context }: ActionFunctionArgs) {

    const method = request.method;
    const KV = context.cloudflare.env.KV;
    let word = await KV.get("todays-word");

    if (process.env.NODE_ENV === "development" && word === null) {
        word = "cactus";
    }

    if (!word) {
        console.error("word not found");
        return new Response(JSON.stringify({
            error: "Word not found",
            correct: null
        }), { status: 500 });
    }
    if (method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }
    const data = await request.json() as { guess: string };
    const correct = data.guess.trim().toLowerCase() === word;

    const session = await getSession(request.headers.get("Cookie"));
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    session.set("gameOver", true);
    session.set("won", correct);

    return new Response(JSON.stringify({
        correct
    }), {
        headers: {
            "Set-Cookie": await commitSession(session, { expires: midnight }),
        },
    })
}