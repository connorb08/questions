export default function ShareResult() {
    const share = () => {
        if (navigator.share) {
            navigator.share({
                title: "Share Result",
                text: "I just played a game of Hangman and my score was 100%!",
                url: "https://hangman.com",
            });
        } else {
            alert("Your browser does not support the Web Share API");
        }
    };

    return <button onClick={share}>Share Result</button>;
}
