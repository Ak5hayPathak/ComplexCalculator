import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';
import { ComplexPower } from './ComplexPower.js';
import { ComplexLog } from './ComplexLog.js';
import { ComplexTrigono } from './ComplexTrigono.js';

export let isDeg = true;

export function Eval(input) {
    input = input.replace(/mod/gi, "MOD")
        .replace(/arg/gi, "ARG")
        .replace(/rec/gi, "REC");

    const tokens = tokenize(input);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
}

function tokenize(expr) {
    const regex = /(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?i?|[+\-*/()]|MOD|ARG|REC|i/g;
    const rawTokens = expr.match(regex);
    if (!rawTokens) return [];

    const tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (token === '-' && (i === 0 || ["+", "-", "*", "/", "(", "MOD", "ARG", "REC"].includes(rawTokens[i - 1]))) {
            tokens.push('u-'); // unary minus
        } else {
            tokens.push(token);
        }
    }
    return tokens;
}

function infixToPostfix(tokens) {
    const precedence = { 'u-': 3, '+': 1, '-': 1, '*': 2, '/': 2 };
    const output = [];
    const stack = [];

    for (const token of tokens) {
        if (isNumber(token) || token === 'i') {
            output.push(token);
        } else if (["MOD", "ARG", "REC"].includes(token)) {
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // pop '('
            if (["MOD", "ARG", "REC"].includes(stack[stack.length - 1])) {
                output.push(stack.pop());
            }
        } else if (["+", "-", "*", "/", "u-"].includes(token)) {
            while (
                stack.length &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (const token of postfix) {
        if (isNumber(token)) {
            stack.push(parseComplex(token));
        } else if (token === 'i') {
            stack.push(new Complex(0, 1));
        } else if (["+", "-", "*", "/"].includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': stack.push(ComplexMath.add(a, b)); break;
                case '-': stack.push(ComplexMath.subtract(a, b)); break;
                case '*': stack.push(ComplexMath.multiply(a, b)); break;
                case '/': stack.push(ComplexMath.divide(a, b)); break;
            }
        } else if (token === 'u-') {
            const z = stack.pop();
            stack.push(ComplexMath.multiply(new Complex(-1, 0), z));
        } else if (["MOD", "ARG", "REC"].includes(token)) {
            const z = stack.pop();
            if (token === "MOD") stack.push(new Complex(z.getMod(), 0));
            if (token === "ARG") {
                stack.push(new Complex(
                    isDeg ? z.getStandardAngle() * (180 / Math.PI) : z.getStandardAngle(), 0
                ));
            }
            if (token === "REC") stack.push(new Complex(z.getReciprocal(), 0));
        }
    }

    return stack.pop();
}

function isNumber(token) {
    return /^((\d+\.?\d*|\.\d+)([eE][+-]?\d+)?i?)$/.test(token);
}

function parseComplex(token) {
    if (token.endsWith("i")) {
        const value = token.slice(0, -1);
        const imag = value === '' || value === '+' ? 1 : value === '-' ? -1 : parseFloat(value);
        return new Complex(0, imag);
    } else {
        return new Complex(parseFloat(token), 0);
    }
}