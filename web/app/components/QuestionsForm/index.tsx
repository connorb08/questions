import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import style from "./style.module.css";
import { useFetcher } from "@remix-run/react";
import { GameData } from "~/utils/types";

export default function QuestionsForm(
    props: PropsWithChildren<{ gameState: GameData }>
) {
    const fetcher = useFetcher();
    const [questiions, setQuestions] = useState(props.gameState.questions);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentQuestion) {
            fetcher.submit(JSON.stringify({ question: currentQuestion }), {
                method: "POST",
                encType: "application/json",
                action: "/api/ask",
            });
        } else {
            setError("Question cannot be empty");
        }
    };

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            // @ts-expect-error: data is a string
            const data = JSON.parse(fetcher.data);
            setQuestions((questions) => [
                ...questions,
                {
                    question: data.question,
                    answer: data.answer,
                },
            ]);
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <div>
            <ul className={style.AskedQuestions}>
                {questiions.map((question, index) => (
                    <li
                        key={index}
                        className={
                            question.answer
                                ? style.CorrectAnswer
                                : style.IncorrectAnswer
                        }
                    >
                        {question.question}
                    </li>
                ))}
            </ul>
            <form className={style.QuestionsForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="current_question"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className={style.AskQuestionInput}
                    disabled={props.gameState.gameOver}
                />
                {error ? <p>{error}</p> : null}
                <button type="submit">Ask</button>
            </form>
        </div>
    );
}
