import { ComplexEval } from './ComplexEval.js';

export class Button{
    static bracketCount = 0;
    static equalFlag = true;
    static toggleState = 0; // 0: normal, 1: -(), 2: ()
    
    static openBracketBtn = document.getElementById("openBracket");
    
    static updateDisplay(display1, display2) {
        if (display1.value !== "" && !["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
            if (this.equalFlag === false && display2.value !== "") {
                display1.value = display2.value;
                display2.value = "";
                this.equalFlag = true;
            }
            return;
        }
        else if (display2 !== "") {
            display1.value += display2.value;
            display2.value = "";
            this.equalFlag = true;
        }
    }
    
    static toggleDegRad() {
        const degOrRadButton = document.getElementById("degOrRad"); // Get the button
        const currentText = degOrRadButton.innerText.trim();
        // Toggle between "DEG" and "RAD"
        if (currentText === "DEG") {
            degOrRadButton.innerText = "RAD";
            ComplexEval.isDeg = false;
        }
        else {
            degOrRadButton.innerText = "DEG";
            ComplexEval.isDeg = true;
        }
    }
    
    static Brackets(display1, display2) {
        if (display1.value.endsWith("=")) {
            if ((display2.value === "") || (display2.value === "Invalid")) {
                return;
            }
            else {
                display1.value = "(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
                return;
            }
        }
        if (display2.value === "") {
            if (display1.value === "" || ["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
                this.updateDisplay(display1, display2);
                display1.value += "(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else if (display1.value.endsWith(".")) { return; }
            else {
                if (this.bracketCount > 0) {
                    this.updateDisplay(display1, display2);
                    display1.value += ")";
                    this.bracketCount--;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
                else {
                    this.updateDisplay(display1, display2);
                    display1.value += "*(";
                    this.bracketCount++;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
            }
        }
        else {
            if (display2.value.endsWith(".")) { return; }
            else if (this.bracketCount > 0) {
                this.updateDisplay(display1, display2);
                display1.value += ")";
                this.bracketCount--;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static leftBracket(display1, display2) {
        if (display1.value.endsWith("=")) {
            if ((display2.value === "") || (display2.value === "Invalid")) {
                return;
            }
            else {
                display1.value = "(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
                return;
            }
        }
        if (display2.value === "") {
            if (display1.value === "" || ["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
                this.updateDisplay(display1, display2);
                display1.value += "(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else if (display1.value.endsWith(".")) { return; }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
        else {
            if (display2.value.endsWith(".")) { }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static rightBracket(display1, display2) {
        if (this.bracketCount !== 0) {
            this.updateDisplay(display1, display2);
            if (this.bracketCount > 0 && !["+", "-", "*", "/", "(", "."].some(op => display1.value.endsWith(op))) {
                display1.value += ")";
                this.bracketCount--;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static updateBracketDisplay(openBracketBtn) {
        this.openBracketBtn.innerText = this.bracketCount === 0 ? "" : `${this.bracketCount}`;
    }
    
    static modulus(display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) {
            return;
        }
        else if (display1.value.endsWith(")")) {
            display1.value += "*mod(";
            this.bracketCount++;
            this.updateBracketDisplay(this.openBracketBtn);
        }
        else if (display2.value === "" || ["+", "-", "*", "/", "("].some(op => display2.value.endsWith(op))) {
            this.updateDisplay(display1, display2);
            display1.value += "mod(";
            this.bracketCount++;
            this.updateBracketDisplay(this.openBracketBtn);
        }
        else {
            if (display1.value === "" || display1.value.endsWith("=")) {
                display1.value = "mod(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*mod(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static clearAll(display1, display2) {
        display1.value = display2.value = "";
        this.bracketCount = 0;
        this.updateBracketDisplay(this.openBracketBtn);
    }
    
    static backspace(display1, display2) {
        if (display2.value === "") {
            if (display1.value !== "") {
                const val = display1.value;
                const len = val.length;
    
                // Check for special statics like "mod(", "arg(", or "rec("
                const suffix = val.slice(-4);
    
                if (suffix === "mod(" || suffix === "arg(" || suffix === "rec(") {
                    display1.value = val.slice(0, -4);
                    this.bracketCount--;
                    this.updateBracketDisplay(this.openBracketBtn);
                } else {
                    const lastChar = val[len - 1];
                    if (lastChar === "(") {
                        this.bracketCount--;
                        this.updateBracketDisplay(this.openBracketBtn);
    
                    } else if (lastChar === ")") {
                        this.bracketCount++;
                        this.updateBracketDisplay(this.openBracketBtn);
                    }
                    display1.value = val.slice(0, -1);
                }
            }
        } else {
            if (display2.value === "Invalid") {
                display2.value = "";
            }
            else if (display1.value.endsWith("=")) {
                display1.value = display1.value.slice(0, -1);
                display2.value = "";
                this.equalFlag = true;
            }
            else {
                display2.value = display2.value.slice(0, -1);
            }
        }
    }
    
    static reciprocal(display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
        else if (display2.value === "") {
    
            if (display1.value === "") {
                display1.value += "rec(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                if (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
                    display1.value += "rec(";  // Wrap the existing value in modulus
                    this.bracketCount++;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
                else {
                    display1.value += "*rec(";
                    this.bracketCount++;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
            }
        }
        else {
            if (display1.value === "" || display1.value.endsWith("=")) {
                display1.value = "rec(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*rec(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static args(display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) {
            return;
        }
    
        else if (display2.value === "") {
            if (display1.value === "") {
                display1.value += "arg(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                if (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
                    display1.value += "arg(";  // Wrap the existing value in modulus
                    this.bracketCount++;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
                else {
                    display1.value += "*arg(";
                    this.bracketCount++;
                    this.updateBracketDisplay(this.openBracketBtn);
                }
            }
        }
        else {
            if (display1.value === "" || display1.value.endsWith("=")) {
                display1.value = "arg(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
            else {
                this.updateDisplay(display1, display2);
                display1.value += "*arg(";
                this.bracketCount++;
                this.updateBracketDisplay(this.openBracketBtn);
            }
        }
    }
    
    static iota(display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
        else if (!display2.value.endsWith(".")) {
            if (display1.value.endsWith("=")) {
                display1.value = "";
                if (display2.value.endsWith("i")) {
                    display2.value += "*i";
                }
                else {
                    display2.value += "i";
                }
            }
            else if (display2.value.endsWith("i")) {
                this.updateDisplay(display1, display2);
                display1.value += "*i";
                this.equalFlag = true;
            }
            else {
                display2.value += "i";
                this.equalFlag = true;
            }
        }
    }
    
    static numVal(numValue, display1, display2) {
    
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (this.countDigits(display2.value + numValue) > 32) {
            return;
        }
        if (numValue === "0" && (display2.value === "" || display2.value === "0")) {
            return;
        }
        if (display2.value === "") {
            display2.value = numValue;
        }
        else if (!["+", "-", "*", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "("].some(op => display1.value.endsWith(op))) {
            display1.value += ("*" + numValue);
            this.updateDisplay(display1, display2);
        }
        else {
            if (display1.value.endsWith("=")) {
                display1.value = "";
            }
            display2.value += numValue;
        }
    }
    
    static basicOps(val, display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
    
        // Helper: get operator character
        const getOperator = (val) => {
            switch (val) {
                case "add": return "+";
                case "subtract": return "-";
                case "multiply": return "*";
                case "divide": return "/";
                default: return "";
            }
        };
    
        const operator = getOperator(val);
    
        // If display1 ends with '(', allow only '-' for negative numbers
        if (display1.value.endsWith("(") && display2.value === "") {
            if (val === "subtract") {
                this.updateDisplay(display1, display2);
                display1.value += "-";
            }
            return;
        }
    
        // If nothing in display2 (pending number), and display1 is also empty
        if (display2.value === "") {
            if (display1.value === "") {
                display1.value = "0" + operator;
                this.equalFlag = true;
                return;
            }
    
            // Prevent multiple operators in a row
            if (["+", "-", "*", "/"].includes(display1.value.at(-1))) {
                display1.value = display1.value.slice(0, -1) + operator;
                return;
            }
    
            // Don't allow operator after a dot (incomplete number)
            if (display1.value.endsWith(".")) {
                return;
            }
    
            // Add operator if valid
            display1.value += operator;
            this.equalFlag = true;
            return;
        }
    
        // If display2 has a value, append it to display1 and then operator
        if (!(display2.value.endsWith(".") || display1.value.endsWith("."))) {
            this.updateDisplay(display1, display2);
            display1.value += operator;
        }
    }
    
    static decimal(display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        let lastNum1 = display1.value.split(/[\+\-\*\/\(\)]/).pop(); // Extract last number
        let lastNum2 = display2.value.split(/[\+\-\*\/\(\)]/).pop(); // Extract last number
    
        if (["+", "-", "*", "/", "("].some(op => display2.value.endsWith(op))) {
            display2.value += "0.";  // Start a new number with "0."
        }
        else if (display2.value === "") {
            display2.value = "0.";  // Prevent leading "."
        }
        else if ([")", "i"].some(op => display2.value.endsWith(op))) {
            display2.value += "*0.";  // Implicit multiplication
        }
        else if (display2.value.endsWith(".")) {
            return;  // Prevent multiple consecutive dots
        }
        else if (lastNum1.includes(".") || lastNum2.includes(".")) {
            return;  // Prevent multiple dots in the same number
        }
        else {
            display2.value += ".";
        }
    
    }
    
    static togglePlusMinus(display1, display2) {
    
        let expr = display1.value;
    
        if ((expr.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (expr !== "" && !expr.endsWith("=")) {
    
            if ((["+", "-", "*", "/", "(", "."].some(op => expr.endsWith(op)))) {
                return;
            }
    
            if (this.toggleState === 0) {
                display1.value = `-(${expr})`;
                this.toggleState = 1;
            } else if (this.toggleState === 1) {
                if (expr.startsWith("-(") && expr.endsWith(")")) {
                    display1.value = `(${expr.slice(2, -1)})`;
                    this.toggleState = 2;
                }
            } else if (this.toggleState === 2) {
                if (expr.startsWith("(") && expr.endsWith(")")) {
                    display1.value = expr.slice(1, -1);
                    this.toggleState = 0;
                }
            }
        }
    }
    
    static equals(display1, display2) {
        if (!this.equalFlag) return;
    
        if (display1.value !== "" || display2.value !== "") {

            if (!["+", "-", "*", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "("].some(op => display1.value.endsWith(op)) && display2.value !== "") {
                display1.value += "*";
            }
            
            const expression = display1.value + display2.value;
    
            if (/[+\-*/(.]$/.test(expression)) return;
    
            try {
                console.log("Evaluating expression:", expression);
                const output = ComplexEval.eval(expression);
                console.log("Eval result:", output);
    
                const result = output.toString(6);
                display1.value += display2.value + "=";
                display2.value = result;
            } catch (e) {
                console.error("Evaluation Error:", e);
                display1.value += "=";
                display2.value = "Invalid";
            }
        }
        this.equalFlag = false;
    }

    static countDigits(str) {
        return (str.match(/\d/g) || []).length;
    }
}