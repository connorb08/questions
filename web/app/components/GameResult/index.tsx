import { PropsWithChildren } from "react";
import { GameData } from "~/utils/types";

function ShareResult(props: PropsWithChildren<{ gameState: GameData }>) {
    const text = `I just ${
        props.gameState.won ? "won" : "lost"
    } a game of questions using ${
        props.gameState.questions.length
    } questions! ${props.gameState.questions
        .map((question) => {
            return `${question.answer ? "✅" : "❌"}`;
        })
        .join("")}`;

    const share = () => {
        if (navigator.share) {
            navigator.share({
                title: "Share Result",
                text,
                url: "https://questions.connorbray.net",
            });
        } else {
            alert(
                `Your browser does not support the Web Share API. Result: ${text}`
            );
        }
    };

    return <button onClick={share}>Share Result</button>;
}

export default function GameResult(
    props: PropsWithChildren<{ gameState: GameData }>
) {
    return (
        <>
            <div className="game-result">
                <h2>{props.gameState.won ? "You won!" : "You lost!"}</h2>
                <p>
                    {props.gameState.won
                        ? "Congratulations!"
                        : "Better luck next time!"}
                </p>
            </div>
            <ShareResult gameState={props.gameState} />
        </>
    );
}
