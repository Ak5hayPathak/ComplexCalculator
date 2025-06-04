import { Eval, state, operatorState, operatorStateTrigono } from './ComplexEval.js';

export class Button {
    static bracketCount = 0;
    static equalFlag = true;
    static toggleState = 0; // 0: normal, 1: -(), 2: ()

    static openBracketBtn = document.getElementById("openBracket");

    static updateDisplay(display1, display2) {
        // Case 1: display1 is non-empty and does not end with an operator
        if (
            display1.value !== "" &&
            !["+", "-", "*", "/", "(", "^", "log", "root"].some(op => display1.value.endsWith(op))
        ) {
            if (!this.equalFlag && display2.value !== "") {
                display1.value = display2.value;
                display2.value = "";
                this.equalFlag = true;
            }
            return;
        }

        // Case 2: If display2 is non-empty, append it to display1
        if (display2.value !== "") {
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
            state.isDeg = false;
        }
        else {
            degOrRadButton.innerText = "DEG";
            state.isDeg = true;
        }
    }

    static updateTrigonoDisplay() {
        const operatorPairs = [
            document.getElementById("sin"),
            document.getElementById("cos"),
            document.getElementById("tan"),
            document.getElementById("csc"),
            document.getElementById("sec"),
            document.getElementById("cot")
        ];

        const isInverse = operatorStateTrigono.isInverse;
        const isHyper = operatorStateTrigono.isHyper;

        for (const op of operatorPairs) {
            const [std, inv, hyp, invhyp] = op.children;

            std.style.display = "none";
            inv.style.display = "none";
            hyp.style.display = "none";
            invhyp.style.display = "none";

            if (!isInverse && !isHyper) std.style.display = "inline";
            if (isInverse && !isHyper) inv.style.display = "inline";
            if (!isInverse && isHyper) hyp.style.display = "inline";
            if (isInverse && isHyper) invhyp.style.display = "inline";
        }
    }

    static toggleInverseTrigono() {
        const toggleButton = document.getElementById("trigonotoggle");

        toggleButton.addEventListener('click', () => {
            const isInverse = operatorStateTrigono.isInverse;

            toggleButton.style.backgroundColor = isInverse ? "#3a3a3a" : "#FF3D00";
            toggleButton.children[0].style.display = isInverse ? "inline" : "none"; // →
            toggleButton.children[1].style.display = isInverse ? "none" : "inline"; // ←

            operatorStateTrigono.isInverse = !isInverse;

            this.updateTrigonoDisplay(); // Recalculate all displays
        });
    }

    static toggleHyperTrigono() {
        const toggleButton = document.getElementById("hyp");

        toggleButton.addEventListener('click', () => {
            const isHyper = operatorStateTrigono.isHyper;

            toggleButton.style.backgroundColor = isHyper ? "#3a3a3a" : "#FF3D00";

            operatorStateTrigono.isHyper = !isHyper;

            this.updateTrigonoDisplay(); // Recalculate all displays
        });
    }


    static toggleOperators() {
        const toggleButton = document.getElementById("toggleOperators");

        const operatorPairs = [
            document.getElementById("sqrOrCube"),
            document.getElementById("sqrtOrCbrt"),
            document.getElementById("powerOrRoot"),
            document.getElementById("tenPowerOrTwoPower"),
            document.getElementById("log10OrLog"),
            document.getElementById("lnOrE"),
            document.getElementById("toggleOperators")
        ];

        const isAlt = operatorState.isBool;
        toggleButton.style.backgroundColor = isAlt ? "#FF3D00" : "#303030";

        for (const op of operatorPairs) {
            if (op.children.length >= 2) {
                op.children[0].style.display = isAlt ? "none" : "inline";
                op.children[1].style.display = isAlt ? "inline" : "none";
            }
        }

        operatorState.isBool = !isAlt;
    }

    static Brackets(display1, display2) {
        const endsWithOp = (str) => ["+", "-", "*", "/", "^", "(", "log", "root", "."].some(op => str.endsWith(op));
        const isDisplay2Valid = display2.value !== "" && display2.value !== "Invalid";
        const isEndWithEqual = display1.value.endsWith("=");

        if (isEndWithEqual && isDisplay2Valid) {
            display1.value = "(";
            this.bracketCount++;
            this.updateBracketDisplay(this.openBracketBtn);
            return;
        }

        const shouldAddOpening = () => (
            display1.value === "" || endsWithOp(display1.value)
        );

        const shouldAddClosing = () => (
            !display1.value.endsWith(".") && this.bracketCount > 0
        );

        this.updateDisplay(display1, display2);

        if (display2.value === "") {
            if (shouldAddOpening()) {
                display1.value += "(";
                this.bracketCount++;
            } else if (shouldAddClosing()) {

                display1.value += ")";
                this.bracketCount--;
            } else {
                display1.value += "*(";
                this.bracketCount++;
            }
        } else {
            if (display2.value.endsWith(".")) return;

            if (this.bracketCount > 0) {

                if (
                    display2.value.endsWith("E") ||
                    display2.value.endsWith("E+") ||
                    display2.value.endsWith("E-")
                ) {
                    return;
                }

                display1.value += ")";
                this.bracketCount--;
            } else {
                display1.value += "*(";
                this.bracketCount++;
            }
        }

        this.updateBracketDisplay(this.openBracketBtn);
    }

    static leftBracket(display1, display2) {
        const isDisplay2Invalid = display2.value === "" || display2.value === "Invalid";
        const endsWithOperator = ["+", "-", "*", "^", "/", "(", "log", "root", "."].some(op => display1.value.endsWith(op));

        // Case: after evaluation (e.g. after "=")
        if (display1.value.endsWith("=")) {
            if (isDisplay2Invalid) return;

            display1.value = "(";
            this.bracketCount++;
            this.updateBracketDisplay(this.openBracketBtn);
            return;
        }

        if (display2.value === "") {
            if (display1.value === "" || endsWithOperator) {
                this.updateDisplay(display1, display2);
                display1.value += "(";
            } else if (!display1.value.endsWith(".")) {
                this.updateDisplay(display1, display2);
                display1.value += "*(";
            } else {
                return;
            }
        } else {
            if (!display2.value.endsWith(".")) {
                this.updateDisplay(display1, display2);
                display1.value += "*(";
            }
        }

        this.bracketCount++;
        this.updateBracketDisplay(this.openBracketBtn);
    }

    static rightBracket(display1, display2) {
        console.log("Right bracket clicked. Bracket count:", this.bracketCount);

        if (this.bracketCount === 0) return;

        const invalidEndings = ["+", "-", "*", "/", "(", ".", "^", "log", "root"];

        this.updateDisplay(display1, display2);

        if (!invalidEndings.some(op => display1.value.trim().endsWith(op))) {
            display1.value += ")";
            this.bracketCount--;
            this.updateBracketDisplay(this.openBracketBtn);
        }
    }

    static updateBracketDisplay(openBracketBtn) {
        this.openBracketBtn.innerText = this.bracketCount === 0 ? "" : `${this.bracketCount}`;
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

                // Handle known function patterns
                const specialFuncs = ["mod(", "arg(", "rec(", "sqr(", "sqrt(", "conj(",
                    "log10(", "ln(", "cube(", "cbrt(", "log", "root",
                    "sin(", "cos(", "tan(", "csc(", "sec(", "cot(",
                    "arcsin(", "arccos(", "arctan(", "arccsc(", "arcsec(", "arccot(",
                    "sinh(", "cosh(", "tanh(", "csch(", "sech(", "coth(",
                    "arcsinh(", "arccosh(", "arctanh(", "arccsch(", "arcsech(", "arccoth("];

                const matchedFunc = specialFuncs.find(func => val.endsWith(func));

                if (matchedFunc) {
                    display1.value = val.slice(0, -matchedFunc.length);
                    if (!(matchedFunc === "log" || matchedFunc === "root")) this.bracketCount--;
                } else {
                    const lastChar = val[len - 1];
                    if (lastChar === "(") this.bracketCount--;
                    else if (lastChar === ")") this.bracketCount++;

                    display1.value = val.slice(0, -1);
                }

                this.updateBracketDisplay(this.openBracketBtn);
            }
        } else {
            if (display2.value === "Invalid") {
                display2.value = "";
            } else if (display1.value.endsWith("=")) {
                display1.value = display1.value.slice(0, -1);
                display2.value = "";
                this.equalFlag = true;
            } else {
                display2.value = display2.value.slice(0, -1);
            }
        }
    }

    static iota(display1, display2) {
        // Exit early if invalid state
        if (
            (display1.value.endsWith("=") && display2.value === "") ||
            display2.value === "Invalid"
        ) {
            return;
        }

        // Avoid adding i after a decimal point
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) {
            return;
        }

        // Handle case when last operation was '='
        if (display1.value.endsWith("=")) {
            display1.value = "";
            display2.value += display2.value.endsWith("i") ? "*i" : "i";
        }

        // If i is already at the end, multiply by another i
        else if (display2.value.endsWith("i")) {
            this.updateDisplay(display1, display2);
            display1.value += "*i";
            this.equalFlag = true;
        }

        // Normal case: just append i
        else {
            display2.value += "i";
            this.equalFlag = true;
        }
    }

    static numVal(numValue, display1, display2) {
        // Prevent input after evaluation or on invalid state
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }

        // Limit digit count to 32
        if (this.countDigits(display2.value + numValue) > 50) {
            return;
        }

        // Avoid leading zeroes like "00", "000", etc.
        if (numValue === "0" && (display2.value === "" || display2.value === "0")) {
            return;
        }

        // Append number to empty display
        if (display2.value === "") {
            display2.value = numValue;
            return;
        }

        // If display ends with 'i', multiply it with the number
        if (display2.value.endsWith("i")) {
            display2.value += "*" + numValue;
            this.updateDisplay(display1, display2);
            display2.value = "";
            return;
        }

        // Clear display1 if previous operation was '='
        if (display1.value.endsWith("=")) {
            display1.value = "";
        }

        // Append digit normally
        display2.value += numValue;
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
                case "power": return "^";
                case "log": return "log";
                case "root": return "root";
                default: return "";
            }
        };

        const operator = getOperator(val);

        if (display2.value.endsWith("E")) {
            if (val === "subtract") {
                display2.value += "-0";
            }
            else if (val === "add") {
                display2.value += "+0";
            }
            return;
        }

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
                if (val !== "log" && val !== "root") {
                    display1.value = "0" + operator;
                    this.equalFlag = true;
                }
                return;
            }

            // Prevent multiple operators in a row
            if (["+", "-", "*", "/", "^"].includes(display1.value.at(-1))) {
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
        const d1 = display1.value;
        const d2 = display2.value;

        if ((d1.endsWith("=") && d2 === "") || d2 === "Invalid") return;

        const lastToken1 = d1.split(/[\+\-\*\/\(\)]/).pop();
        const lastToken2 = d2.split(/[\+\-\*\/\(\)]/).pop();

        // Start a new number with "0." if the expression just ended with an operator
        if (["+", "-", "*", "/", "(", "^", "log", "root"].some(op => d2.endsWith(op))) {
            display2.value += "0.";
            return;
        }

        // If display2 is empty, also start with "0."
        if (d2 === "") {
            display2.value = "0.";
            return;
        }

        // If the last input is an imaginary number (ends with 'i')
        if (d2.endsWith("i")) {
            display1.value += d2 + "*";
            display2.value = "0.";
            return;
        }

        // Prevent multiple consecutive dots
        if (d2.endsWith(".")) return;

        // Prevent decimal inside incomplete exponent like "2E+", "3e-", etc.
        const incompleteExponentPattern = /[eE][+\-]?$/;
        if (incompleteExponentPattern.test(lastToken2)) return;

        // Prevent multiple dots in the current number segment
        if (lastToken2.includes(".")) return;

        // Otherwise, add decimal point
        display2.value += ".";
    }

    static togglePlusMinus(display1, display2) {

        let expr = display1.value;

        if ((expr.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
            return;
        }
        if (expr !== "" && !expr.endsWith("=")) {

            if ((["+", "-", "*", "/", "(", ".", "E", "^", "log", "root"].some(op => expr.endsWith(op)))) {
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

    static insertConstant(constant, display1, display2) {
        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") return;
        if (display2.value.endsWith(".") || display1.value.endsWith(".") || display1.value.endsWith("E")) return;

        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ")", "i"].some(op => display2.value.endsWith(op))) {
            this.updateDisplay(display1, display2);
            display1.value += `*(${constant})`;
        }
        else {
            display2.value += `${constant}`;
        }
    }

    static e(display1, display2) {
        this.insertConstant("2.7182818284590452353602874713527", display1, display2);
    }

    static pi(display1, display2) {
        this.insertConstant("3.1415926535897932384626433832795", display1, display2);
    }

    static omega(display1, display2) {
        this.insertConstant("-0.5+0.8660254037844386467637231707529i", display1, display2);
    }

    static omega_sqr(display1, display2) {
        this.insertConstant("-0.5-0.8660254037844386467637231707529i", display1, display2);
    }

    static EulerMascheroni(display1, display2) {
        this.insertConstant("0.5772156649015328606065120900824", display1, display2);
    }

    static Golden_ratio(display1, display2) {
        this.insertConstant("1.6180339887498948482045868343656", display1, display2);
    }

    static Catalan(display1, display2) {
        this.insertConstant("0.9159655941772190150546035149324", display1, display2);
    }

    static Apery(display1, display2) {
        this.insertConstant("1.2020569031595942853997381615114", display1, display2);
    }

    static Feigenbaum1(display1, display2) {
        this.insertConstant("4.6692016091029906718532038204662", display1, display2);
    }

    static Feigenbaum2(display1, display2) {
        this.insertConstant("2.5029078750958928222839028732182", display1, display2);
    }

    static Khinchin(display1, display2) {
        this.insertConstant("2.6854520010653064453097148354818", display1, display2);
    }

    static Liouville(display1, display2) {
        // Liouville's constant approximated to 31 decimals
        this.insertConstant("0.1100010000000000000000000000000", display1, display2);
    }

    static PlasticNumber(display1, display2) {
        this.insertConstant("1.3247179572447460259609088544781", display1, display2);
    }

    static lnNegOne(display1, display2) {
        // ln(-1) principal value = i * pi
        this.insertConstant("3.1415926535897932384626433832795i", display1, display2);
    }


    static equals(display1, display2, precision) {
        if (!this.equalFlag) return;

        if (display1.value !== "" || display2.value !== "") {
            // Insert '*' if display1 ends with something other than operators, numbers, '.', or '(' and display2 isn't empty
            if (
                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ")", "i"]
                    .some(op => display1.value.endsWith(op)) &&
                display2.value !== ""
            ) {
                display1.value += "*";
            }

            const expression = (display1.value + display2.value).trim();

            // Prevent evaluation if expression ends with operator or '('
            if (/[+\-*/(^.]$/.test(expression)) return;

            display1.value += display2.value + "=";

            try {
                const output = Eval(expression);
                // Assuming output has toString(precision)
                const result = output.toString ? output.toString(precision) : output.toFixed(precision);
                display2.value = result;
            } catch (e) {
                display2.value = "Invalid";
            }
        }
        this.equalFlag = false;
    }

    static insertFunction(display1, display2, funcString, needsMultiply = true, addBracket = true) {
        const needsBracketUpdate = () => {
            this.bracketCount++;
            this.updateBracketDisplay(this.openBracketBtn);
        };

        const endsWithOperator = (str) => {
            return ["+", "-", "*", "/", "^", "(", ".", "log", "root"].some(op => str.endsWith(op));
        };

        if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") return;
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) return;

        if (display2.value === "") {
            if (display1.value === "") {
                display1.value += funcString + (addBracket ? "(" : "");
                if (addBracket) needsBracketUpdate();
            } else {
                if (endsWithOperator(display1.value)) {
                    display1.value += funcString + (addBracket ? "(" : "");
                    if (addBracket) needsBracketUpdate();
                } else {
                    display1.value += (needsMultiply ? "*" : "") + funcString + (addBracket ? "(" : "");
                    if (addBracket) needsBracketUpdate();
                }
            }
        } else {
            if (display1.value === "" || display1.value.endsWith("=")) {
                display1.value = funcString + (addBracket ? "(" : "");
                if (addBracket) needsBracketUpdate();
            } else {
                this.updateDisplay(display1, display2);
                display1.value += (needsMultiply ? "*" : "") + funcString + (addBracket ? "(" : "");
                if (addBracket) needsBracketUpdate();
            }
        }
    }

    static reciprocal(display1, display2) {
        this.insertFunction(display1, display2, "rec");
    }

    static args(display1, display2) {
        this.insertFunction(display1, display2, "arg");
    }

    static modulus(display1, display2) {
        this.insertFunction(display1, display2, "mod");
    }

    static square(display1, display2) {
        this.insertFunction(display1, display2, "sqr");
    }

    static squareRoot(display1, display2) {
        this.insertFunction(display1, display2, "sqrt");
    }

    static cube(display1, display2) {
        this.insertFunction(display1, display2, "cube");
    }

    static cubeRoot(display1, display2) {
        this.insertFunction(display1, display2, "cbrt");
    }

    static tenToPow(display1, display2) {
        this.insertFunction(display1, display2, "10^", true, false);
    }

    static twoToPow(display1, display2) {
        this.insertFunction(display1, display2, "2^", true, false);
    }

    static log10(display1, display2) {
        this.insertFunction(display1, display2, "log10");
    }

    static eToZ(display1, display2) {
        this.insertFunction(display1, display2, "(2.7182818284590452353602874713527)^", true, false);
    }

    static ln(display1, display2) {
        this.insertFunction(display1, display2, "ln");
    }

    static conj(display1, display2) {
        this.insertFunction(display1, display2, "conj");
    }

    static sin(display1, display2) {
        this.insertFunction(display1, display2, "sin");
    }
    static cos(display1, display2) {
        this.insertFunction(display1, display2, "cos");
    }
    static tan(display1, display2) {
        this.insertFunction(display1, display2, "tan");
    }
    static csc(display1, display2) {
        this.insertFunction(display1, display2, "csc");
    }
    static sec(display1, display2) {
        this.insertFunction(display1, display2, "sec");
    }
    static cot(display1, display2) {
        this.insertFunction(display1, display2, "cot");
    }


    static arcsin(display1, display2) {
        this.insertFunction(display1, display2, "arcsin");
    }
    static arccos(display1, display2) {
        this.insertFunction(display1, display2, "arccos");
    }
    static arctan(display1, display2) {
        this.insertFunction(display1, display2, "arctan");
    }
    static arccsc(display1, display2) {
        this.insertFunction(display1, display2, "arccsc");
    }
    static arcsec(display1, display2) {
        this.insertFunction(display1, display2, "arcsec");
    }
    static arccot(display1, display2) {
        this.insertFunction(display1, display2, "arccot");
    }

    static sinh(display1, display2) {
        this.insertFunction(display1, display2, "sinh");
    }
    static cosh(display1, display2) {
        this.insertFunction(display1, display2, "cosh");
    }
    static tanh(display1, display2) {
        this.insertFunction(display1, display2, "tanh");
    }
    static csch(display1, display2) {
        this.insertFunction(display1, display2, "csch");
    }
    static sech(display1, display2) {
        this.insertFunction(display1, display2, "sech");
    }
    static coth(display1, display2) {
        this.insertFunction(display1, display2, "coth");
    }

    static arcsinh(display1, display2) {
        this.insertFunction(display1, display2, "arcsinh");
    }
    static arccosh(display1, display2) {
        this.insertFunction(display1, display2, "arccosh");
    }
    static arctanh(display1, display2) {
        this.insertFunction(display1, display2, "arctanh");
    }
    static arccsch(display1, display2) {
        this.insertFunction(display1, display2, "arccsch");
    }
    static arcsech(display1, display2) {
        this.insertFunction(display1, display2, "arcsech");
    }
    static arccoth(display1, display2) {
        this.insertFunction(display1, display2, "arccoth");
    }

    static toggleWithOutsideClick(triggerId, targetId, displayMode = 'block', activeBg = '', defaultBg = '') {
        const trigger = document.querySelector(triggerId);
        const target = document.querySelector(targetId);

        if (!trigger || !target) return;

        // Toggle display and background color on trigger click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = target.style.display === displayMode;

            target.style.display = isVisible ? 'none' : displayMode;
            trigger.style.backgroundColor = isVisible ? defaultBg : activeBg;
        });

        // Prevent target clicks from closing the panel
        target.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Clicking anywhere else hides the target and resets background
        document.addEventListener('click', () => {
            target.style.display = 'none';
            trigger.style.backgroundColor = defaultBg;
        });
    }

    static exp(display1, display2) {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(op => display2.value.endsWith(op))) {
            display2.value += "E+0";
        }
    }

    static countDigits(str) {
        return (str.match(/\d/g) || []).length;
    }
}