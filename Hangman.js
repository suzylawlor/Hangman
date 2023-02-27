// Import necessary modules
import React, { useState, useEffect } from "react";
import "./index.css";

// Define a functional component named Hangman
const Hangman = () => {
  // Define state variables using the useState hook
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [hangmanImage, setHangmanImage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Define an asynchronous function to fetch a random word from a dictionary
  const getRandomWord = async () => {
    // Send a GET request to /dictionary.txt
    const response = await fetch("/dictionary.txt");
    // Retrieve the response as text
    const words = await response.text();
    // Split the text by newline characters to create an array of words
    const wordArray = words.split("\n");
    // Generate a random index within the bounds of the wordArray
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    // Set the word state variable to a randomly selected word in the wordArray, converted to uppercase
    setWord(wordArray[randomIndex].toUpperCase());
  };

  // Define a function to handle user guesses
  const handleGuess = (letter) => {
    // Check if the guessed letter has already been guessed
    if (!guessedLetters.includes(letter)) {
      // Add the guessed letter to the guessedLetters array using the spread operator
      setGuessedLetters([...guessedLetters, letter]);
      // If the guessed letter is not in the word, decrease the guessesLeft count and update the hangmanImage state variable
      if (!word.includes(letter)) {
        setGuessesLeft(guessesLeft - 1);
        setHangmanImage(hangmanImage + 1);
      }
    }
  };

  // Call the getRandomWord function when the component is mounted
  useEffect(() => {
    getRandomWord();
  }, []);

  // Use the useEffect hook to check if the game is over or if the player has won
  useEffect(() => {
    // If there are no more guesses left, set the gameOver state variable to true
    if (guessesLeft === 0) {
      setGameOver(true);
    }
    // If the word and guessedLetters state variables are defined
    if (word && guessedLetters) {
      // Convert the word to an array of letters
      const wordArray = word.split("");
      // Filter the wordArray to only include the guessed letters
      const filteredWord = wordArray.filter((letter) =>
        guessedLetters.includes(letter)
      );
      // If the filteredWord has the same length as the original word, the player has won
      if (filteredWord.length === wordArray.length) {
        setGameWon(true);
      }
    }
  }, [guessesLeft, guessedLetters, word]);

  // Define a function to get the URL of the hangman image to display
  const getHangmanImage = () => {
    return `/hangmandrawings/state${hangmanImage + 1}.gif`;
  };

  // Define a function to handle restarting the game
  const handleRestart = () => {
    // Reset all state variables to their initial values
    setWord("");
    setGuessedLetters([]);
    setGuessesLeft(10);
    setGameOver(false);
    setGameWon(false);
    setHangmanImage(0);
    setShowHelp(false);
    getRandomWord();
  };

  // Define a function to handle showing the help message
  const handleHelp = () => {
    setShowHelp(true);
  };

  // Render the Hangman component
  return (
    // Display the container div
    <div className="container">
      {gameOver && <p className="game-over">Game over! The word was {word}</p>}
      {gameWon && <p className="game-won">Congratulations, you won!</p>}
      {showHelp && (
        <div className="help">
          <p>Hangman is a guessing game.</p>
          <p>
            A word is chosen at random, and the player must guess letters of the
            word.
          </p>
          <p>
            If the player guesses a letter that is in the word, the letter is
            revealed.
          </p>
          <p>
            If the player guesses a letter that is not in the word, a part of
            the hangman is drawn.
          </p>
          <p>
            The player has 10 guesses to correctly guess the word before the
            hangman is fully drawn.
          </p>

          <button className="button" onClick={() => setShowHelp(false)}>
            {" "}
          </button>
        </div>
      )}{" "}
      {!gameOver && !gameWon && !showHelp && (
        <div className="container">
          <div className="game-info">
            <p className="guesses-left">Guesses left: {guessesLeft}</p>
            <img
              className="hangman-image"
              src={getHangmanImage()}
              alt={`Hangman image ${hangmanImage}`}
            />
          </div>

          <div className="letters">
            {word.split("").map((letter, index) => {
              if (guessedLetters.includes(letter)) {
                return (
                  <span key={index} className="letter">
                    {letter}
                  </span>
                );
              } else {
                return (
                  <span key={index} className="letter">
                    _
                  </span>
                );
              }
            })}
          </div>

          <div>
            {Array.from(Array(26), (_, i) => String.fromCharCode(65 + i)).map(
              (letter) => (
                // Define a button for each letter
                <button
                  key={letter}
                  className={`letter ${
                    guessedLetters.includes(letter) ? "disabled" : ""
                  }`}
                  disabled={guessedLetters.includes(letter)}
                  onClick={() => handleGuess(letter)}
                >
                  {letter}
                </button>
              )
            )}
          </div>
          <button className="button" onClick={handleRestart}>
            Restart
          </button>
          <button className="button" onClick={handleHelp}>
            Help
          </button>
        </div>
      )}
    </div>
  );
};

export default Hangman;
