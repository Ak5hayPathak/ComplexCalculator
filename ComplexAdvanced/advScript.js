import { Button } from '../ComplexUtils/Buttons.js';
import { operatorState } from '../ComplexUtils/ComplexEval.js';

const display1 = document.getElementById("inputBox1");
const display2 = document.getElementById("inputBox2");
const buttons = document.querySelectorAll(".buttons");

const MAX_LENGTH = 1000;  // Set max length for the input

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if ((display1.value.length >= MAX_LENGTH) && !["Backspace", "Escape"].includes(event.key)) {
        alert("Maximum input length reached");
        return;  // Prevent adding more characters
    }
    if (/^[0-9]$/.test(key)) {
        Button.numVal(key, display1, display2);
    }

    switch (key) {
        case "i": Button.iota(display1, display2);
            break;
        case "+": Button.basicOps("add", display1, display2);
            break;
        case "-": Button.basicOps("subtract", display1, display2);
            break;
        case "*": Button.basicOps("multiply", display1, display2);
            break;
        case "/": Button.basicOps("divide", display1, display2);
            break;
        case "m": Button.modulus(display1, display2);
            break;
        case "r": Button.reciprocal(display1, display2);
            break;
        case "a": Button.args(display1, display2);
            break;
        case "d": Button.toggleDegRad();
            break;
        case ".": Button.decimal(display1, display2);
            break;
        case "(": Button.leftBracket(display1, display2);
            break;
        case ")": Button.rightBracket(display1, display2);
            break;
        case "Backspace": Button.backspace(display1, display2);
            break;
        case "Enter": Button.equals(display1, display2, 12);
            break;
        case "Escape": Button.clearAll(display1, display2);
            break;
    }

    // Prevent default for Enter and Backspace to avoid side effects
    if (["Enter", "Backspace"].includes(key)) {
        event.preventDefault();
    }
});

buttons.forEach(button => {
    button.addEventListener("click", () => {

        if (display1.value.length >= MAX_LENGTH && button.id !== "backspace" && button.id !== "clear-all") {
            alert("Maximum input length reached");
            return;  // Prevent adding more characters
        }
        const val = button.id;

        if (val.startsWith("num")) {
            let numValue = val.replace("num", "");
            Button.numVal(numValue, display1, display2);
        }

        switch (val) {
            case "Brackets": Button.Brackets(display1, display2);
                break;
            case "mod": Button.modulus(display1, display2);
                break;
            case "clear-all": Button.clearAll(display1, display2);
                break;
            case "backspace": Button.backspace(display1, display2);
                break;
            case "reciprocal": Button.reciprocal(display1, display2);
                break;
            case "theta": Button.args(display1, display2);
                break;
            case "degOrRad": Button.toggleDegRad();
                break;
            case "iota": Button.iota(display1, display2);
                break;
            case "add": Button.basicOps("add", display1, display2);
                break;
            case "subtract": Button.basicOps("subtract", display1, display2);
                break;
            case "multiply": Button.basicOps("multiply", display1, display2);
                break;
            case "divide": Button.basicOps("divide", display1, display2);
                break;
            case "dot": Button.decimal(display1, display2);
                break;
            case "plusOrMinus": Button.togglePlusMinus(display1, display2);
                break;
            case "sqrOrCube":
                operatorState.isBool ? Button.square(display1, display2) : Button.cube(display1, display2);
                break;
            case "sqrtOrCbrt": 
                operatorState.isBool ? Button.squareRoot(display1, display2) : Button.cubeRoot(display1, display2);
                break;
            case "powerOrRoot": 
                operatorState.isBool ? Button.basicOps("power", display1, display2) : Button.basicOps("root", display1, display2);
                break;
            case "tenPowerOrTwoPower": 
                operatorState.isBool ? Button.tenToPow(display1, display2) : Button.twoToPow(display1, display2);
                break;
            case "log10OrLog": 
                operatorState.isBool ? Button.log10(display1, display2) : Button.basicOps("log", display1, display2);
                break;
            case "lnOrE":
                operatorState.isBool ? Button.ln(display1, display2) : Button.eToZ(display1, display2);
                break;
            case "conj": Button.conj(display1, display2);
                break;
            case "power": Button.basicOps("power", display1, display2);
                break;
            // case "exp": Button.exp(display1, display2);
            //     break;
            case "toggleOperators": Button.toggleOperators();
                break;
            case "e": Button.e(display1, display2);
                break;
            case "pi": Button.pi(display1, display2);
                break;
            case "equals": Button.equals(display1, display2, 15);
                break;
        }
    });
});