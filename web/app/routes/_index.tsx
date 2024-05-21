import {
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import GuessWord from "~/components/GuessWord";
import Header from "~/components/Header";
import QuestionsForm from "~/components/QuestionsForm";
import ShareResult from "~/components/ShareResult";
import { commitSession, getSession } from "~/utils/session";
import { GameData } from "~/utils/types";

export const meta: MetaFunction = () => {
    return [
        { title: "Daily Questions" },
        {
            name: "description",
            content: "Welcome to Remix! Using Vite and Cloudflare Workers!",
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const gameOver = session.get("gameOver") || false;
    const won = session.get("won") || false;
    const questions = session.get("questions") || [];
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return json(
        { gameOver, won, questions },
        {
            headers: {
                "Set-Cookie": await commitSession(session, { expires: d }),
            },
        }
    );
}

export default function Index() {
    const gameData = useLoaderData<typeof loader>() as GameData;
    const [gameState, setGameState] = useState<GameData>(gameData);
    console.log(gameState);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                justifyContent: "center",
                justifyItems: "center",
            }}
        >
            <Header />
            <div
                style={{
                    maxWidth: "720px",
                    margin: "auto",
                }}
            >
                <QuestionsForm gameState={gameState} />
                <GuessWord gameState={gameState} setGameState={setGameState} />
                {gameState.gameOver ? <ShareResult /> : null}
            </div>
        </div>
    );
}
