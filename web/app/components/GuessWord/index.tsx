import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import style from "./style.module.css";
import { useFetcher } from "@remix-run/react";
import { GameData } from "~/utils/types";

export default function GuessWord(
    props: PropsWithChildren<{
        gameState: GameData;
        setGameState: React.Dispatch<React.SetStateAction<GameData>>;
    }>
) {
    const fetcher = useFetcher();
    const [open, setOpen] = useState(false);
    const [guess, setGuess] = useState("");
    const [_error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (guess) {
            fetcher.submit(JSON.stringify({ guess }), {
                method: "POST",
                encType: "application/json",
                action: "/api/guess",
            });
            setOpen(false);
        } else {
            setError("Guess cannot be empty");
        }
    };

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            try {
                // @ts-expect-error: data is a string
                const data = JSON.parse(fetcher.data);
                props.setGameState({
                    gameOver: true,
                    won: data.correct,
                    questions: props.gameState.questions,
                });
            } catch (error) {
                console.error(error);
                setError("Error submitting guess");
            }
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <button onClick={() => setOpen(true)}>Guess Word</button>
            </div>
            {open && (
                <div className={style.GuessPortal}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                        />
                        <button type="submit">Guess</button>
                    </form>
                </div>
            )}
        </>
    );
}
