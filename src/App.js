import { Button, Form } from "react-bootstrap";
import { useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import styles from "./index.module.sass";
import buttons from "./data.js";

// actions
const ACTIONS = {
  ADD_NUMBER: "ADD_NUMBER",
  SET_OPERATOR: "SET_OPERATOR",
  INVERT: "INVERT",
  DECIMAL: "DECIMAL",
  PERCENT: "PERCENT",
  CALCULATE: "CALCULATE",
  CLEAR: "CLEAR",
  DELETE: "DELETE",
};

// initial state
const init = {
  currentInput: "0",
  previousInput: null,
  operator: null,
  waitingForNewInput: false,
};

// do calculate
function calculate(a, b, operator) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const actions = {
    "+": (numA + numB).toString(),
    "-": (numA - numB).toString(),
    "*": (numA * numB).toString(),
    "/": (numA / numB).toString(),
  };

  return actions[operator]?.toString() || "0";
}

function reducer(state, action) {
  // logger
  const { currentInput, previousInput, operator, waitingForNewInput } = state;
  console.log(`Previous state: {${currentInput}, ${previousInput}, ${operator}, ${waitingForNewInput}}`);

  switch (action.type) {
    case ACTIONS.ADD_NUMBER:
      return {
        ...state,
        currentInput: state.waitingForNewInput
          ? action.payload
          : state.currentInput === "0"
          ? action.payload
          : state.currentInput + action.payload,
        waitingForNewInput: false,
      };

    case ACTIONS.SET_OPERATOR:
      if (state.operator && !state.waitingForNewInput) {
        const result = calculate(state.previousInput, state.currentInput, state.operator);
        return {
          ...state,
          currentInput: result,
          previousInput: result,
          operator: action.payload,
          waitingForNewInput: true,
        };
      }
      return {
        ...state,
        currentInput: "0",
        previousInput: state.currentInput,
        operator: action.payload,
      };

    case ACTIONS.CALCULATE:
      if (!state.operator) return state;
      const result = calculate(state.previousInput, state.currentInput, state.operator);
      return {
        ...state,
        currentInput: result,
        previousInput: null,
        operator: null,
        waitingForNewInput: true,
      };

    case ACTIONS.CLEAR:
      return init;

    case ACTIONS.DECIMAL:
      return {
        ...state,
        currentInput: state.currentInput.includes(".") ? state.currentInput : state.currentInput + ".",
      };

    case ACTIONS.PERCENT:
      return {
        ...state,
        currentInput: (parseFloat(state.currentInput) / 100).toString(),
      };

    case ACTIONS.INVERT:
      return {
        ...state,
        currentInput: (parseFloat(state.currentInput) * -1).toString(),
      };

    case ACTIONS.DELETE:
      return {
        ...state,
        currentInput:
          state.currentInput.length - 1 === 0 ? "0" : state.currentInput.slice(0, state.currentInput.length - 1),
      };

    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, init);

  // logger
  const { currentInput, previousInput, operator, waitingForNewInput } = state;
  console.log(`Current state: {${currentInput}, ${previousInput}, ${operator}, ${waitingForNewInput}}`);

  const handleButtonClick = (type, label) => {
    const actions = {
      number: () => dispatch({ type: ACTIONS.ADD_NUMBER, payload: label }),
      operator: () => dispatch({ type: ACTIONS.SET_OPERATOR, payload: label }),
      clear: () => dispatch({ type: ACTIONS.CLEAR }),
      equals: () => dispatch({ type: ACTIONS.CALCULATE }),
      decimal: () => dispatch({ type: ACTIONS.DECIMAL }),
      invert: () => dispatch({ type: ACTIONS.INVERT }),
      percent: () => dispatch({ type: ACTIONS.PERCENT }),
      delete: () => dispatch({ type: ACTIONS.DELETE }),
    };
    actions[type]?.();
  };

  return (
    <div className="App">
      <div className={styles.calculator}>
        <Form.Control type="text" className={styles.input} disabled value={state.currentInput} />
        <div className={styles.btnGroup}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant="primary"
              className={styles.primaryBtn}
              onClick={() => handleButtonClick(button.type, button.label)}>
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
