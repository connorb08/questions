import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { commitSession, getSession } from "~/utils/session";

export async function action({ request, context }: ActionFunctionArgs) {

    const method = request.method;
    const KV = context.cloudflare.env.KV;
    const word = await KV.get("word");
    // const word = "rainbow"

    if (!word) {
        return new Response("Word not found", { status: 404 });
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