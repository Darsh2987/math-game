import "../scss/imports.scss";

window.addEventListener("load", () => {
  // Variables
  const problemElement = document.querySelector("#problem");
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const pointsNeeded = document.querySelector("#points-needed");
  const mistakesAllowed = document.querySelector("#mistakes-allowed");
  const progressBar = document.querySelector("#progress-inner");
  const endMessage = document.querySelector("#end-message");
  const resetButton = document.querySelector("#reset-button");

  let correctAnswer; // Correct answer variable

  // State object
  let state = {
    score: 0,
    wrongAnswers: 0,
  };

  // Function to generate random number - used to randomly generate number 1, number 2 and the operator
  function generateNumber(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  // Function to call generateNumbers() to create random number 1 and 2 and a random operator
  function generateProblem() {
    return {
      numberOne: generateNumber(10),
      numberTwo: generateNumber(10),
      operator: ["+", "-", "x", "/"][generateNumber(3)],
    };
  }

  // Function to update Math problem - generate problem(current problem) and add it to the "state" object, then output that problem to the front end using innerHTML
  function updateProblem() {
    state.currentProblem = generateProblem();
    problemElement.innerHTML = `${state.currentProblem.numberOne} ${state.currentProblem.operator} ${state.currentProblem.numberTwo}`;

    const p = state.currentProblem; // Retrieving the random numbers 1 and 2 and the operator from the "currentProblem" object within the "state" object

    // If statement to create the Math logic/answer depending on the type of operator and storing that answer into the "correctAnswer" variable
    if (p.operator == "+") {
      correctAnswer = p.numberOne + p.numberTwo;
    } else if (p.operator == "-") {
      correctAnswer = p.numberOne - p.numberTwo;
    } else if (p.operator == "x") {
      correctAnswer = p.numberOne * p.numberTwo;
    } else if (p.operator == "/") {
      correctAnswer = Math.round((p.numberOne / p.numberTwo) * 10) / 10;
      // Infinity and NaN handle
      if (correctAnswer === Infinity || correctAnswer === NaN) {
        updateProblem();
      }
    }
  }

  // Event listener "submit" - click submit button or press enter
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents the "form" from default submission actions

    // Check the input value is equal to the correct answer if so increment the "score" within the "state" object and update "pointsNeeded" on the UI, if wrong answer then decrement "wrongAnswers" within the "state" object and then update "mistakeAllowed" on the UI.
    if (parseFloat(input.value) === correctAnswer) {
      state.score++;
      pointsNeeded.textContent = 10 - state.score;
      updateProblem();
      renderProgressBar();
      inputField();
    } else {
      state.wrongAnswers++;
      mistakesAllowed.textContent = 2 - state.wrongAnswers;
      problemElement.classList.add("animate-wrong"); // Animate Math problem text
      setTimeout(() => problemElement.classList.remove("animate-wrong"), 451);
      inputField();
    }

    checkLogic(); // Call "checkLogic"  function
  });

  // Function to check if the user has won or lost - check if "score" is equal to 10 for win or if "wrongAnswers" is equal to 3 for loss. Call reset game function for which ever outcome
  function checkLogic() {
    if (state.score === 10) {
      endMessage.textContent = "Congrats! You won.";
      document.body.classList.add("overlay-is-open");
      setTimeout(() => resetButton.focus(), 331);
    }

    if (state.wrongAnswers === 3) {
      endMessage.textContent = "Sorry! You lost.";
      document.body.classList.add("overlay-is-open");
      setTimeout(() => resetButton.focus(), 331);
    }
  }

  // Click event for overlay reset button
  resetButton.addEventListener("click", resetGame);

  // Function to reset game, update Math problem, reset the "state" object properties and reset the "pointsNeeded" and "mistakeAllowed" points on the UI, remove overlay and reset progress bar
  function resetGame() {
    document.body.classList.remove("overlay-is-open");
    updateProblem();
    state.score = 0;
    state.wrongAnswers = 0;
    pointsNeeded.textContent = 10;
    mistakesAllowed.textContent = 2;
    inputField();
    renderProgressBar(); // Call function to reset progress bar despending on the "state.score"
  }

  function renderProgressBar() {
    progressBar.style.transform = `scaleX(${state.score / 10})`; // Updates UI progress bar when a question is answered correctly
  }

  function inputField() {
    input.value = "";
    input.focus();
  }

  updateProblem();
});
