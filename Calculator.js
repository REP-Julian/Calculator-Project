// Grab the display and the button container from the page
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

// These variables store the calculator's current state
let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetScreen = false;

// Update the visible value on the calculator screen
function updateDisplay() {
  display.value = currentInput;
}

// Add a number or decimal point to the current input
function appendValue(value) {
  // If we just finished a calculation, start fresh on the next number
  if (currentInput === "Error" || shouldResetScreen) {
    currentInput = value === "." ? "0." : value;
    shouldResetScreen = false;
    updateDisplay();
    return;
  }

  // Prevent adding more than one decimal point
  if (value === "." && currentInput.includes(".")) {
    return;
  }

  // Replace the default 0 unless the user is entering a decimal
  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

// Store the selected operator and prepare for the next number
function selectOperator(nextOperator) {
  if (currentInput === "Error") {
    clearCalculator();
  }

  // If an operator already exists and the second number is entered,
  // calculate first so chained operations work correctly
  if (operator && !shouldResetScreen) {
    calculate();
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetScreen = true;
}

// Format the result so long floating point decimals look cleaner
function formatResult(number) {
  return Number(number.toFixed(10)).toString();
}

// Perform the calculation based on the stored operator
function calculate() {
  if (!operator || shouldResetScreen) {
    return;
  }

  const firstNumber = Number(previousInput);
  const secondNumber = Number(currentInput);
  let result = 0;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "*":
      result = firstNumber * secondNumber;
      break;
    case "/":
      result = secondNumber === 0 ? NaN : firstNumber / secondNumber;
      break;
    default:
      return;
  }

  // Show an error if the result is invalid, such as division by zero
  currentInput = Number.isFinite(result) ? formatResult(result) : "Error";
  previousInput = "";
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

// Reset everything back to the initial state
function clearCalculator() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

// Use one click listener for all buttons
buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  // Number and decimal buttons
  if (button.dataset.value !== undefined) {
    appendValue(button.dataset.value);
    return;
  }

  // Operator buttons
  if (button.dataset.action === "operator") {
    selectOperator(button.dataset.operator);
    return;
  }

  // Equals button
  if (button.dataset.action === "calculate") {
    calculate();
    return;
  }

  // Clear button
  if (button.dataset.action === "clear") {
    clearCalculator();
  }
});

// Optional keyboard support for better usability
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    appendValue(key);
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    selectOperator(key);
    return;
  }

  // Allow x or X as multiplication from the keyboard
  if (key === "x" || key === "X") {
    selectOperator("*");
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Escape" || key.toLowerCase() === "c") {
    clearCalculator();
  }
});

// Make sure the display starts with the correct value
updateDisplay();
