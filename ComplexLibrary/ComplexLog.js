import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';

export class ComplexLog {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexLog) {
            throw new Error("ComplexLog cannot be instantiated");
        }
    }

    static ln(num, isImaginary = false) {

        let logE = (complex) => {
            if (complex.isZero()) {
                throw new Error("Log of zero is undefined");
            }
            return new Complex(Math.log(complex.getMod()), complex.getAngle());
        };

        if (num instanceof Complex) {
            return logE(num);
        }

        if (typeof num === "number") {
            return logE(isImaginary ? new Complex(0, num) : new Complex(num, 0));
        }

        throw new Error("Invalid argument: ln expects a Complex number or a real/imaginary number.");
    }

    static log10(num, isImaginary = false) {
        let logBase10 = (complex) => Complex.divide(Complex.ln(complex), Math.log(10));

        if (num instanceof Complex) {
            return logBase10(num);
        }

        if (typeof num === "number") {
            return logBase10(isImaginary ? new Complex(0, num) : new Complex(num, 0));
        }

        throw new Error("Invalid argument: log10 expects a Complex number or a real/imaginary number.");
    }

    static log(base, value, isBaseImaginary = false, isValueImaginary = false, areBothImaginary = false) {
        let logE = (num) => {
            if (num.isZero()) {
                throw new Error("Log of zero is undefined");
            }
            return new Complex(Math.log(num.getMod()), num.getAngle());
        };

        let logDivide = (b, v) => ComplexMath.divide(logE(v), logE(b));

        // Handle Complex base and Complex value
        if (base instanceof Complex && value instanceof Complex) {
            if (base.isZero() || value.isZero()) {
                throw new Error("Log with zero base or value is undefined.");
            }
            if (base.equals(Complex.ONE)) {
                throw new Error("Logarithm base 1 is undefined.");
            }
            if (base.equals(Complex.NEG_ONE)) {
                return ComplexMath.divide(logE(value), new Complex(0.0, Math.PI));
            }
            return logDivide(base, value);
        }

        // Handle Complex base and real/imaginary value
        if (base instanceof Complex && typeof value === "number") {
            return logDivide(base, isValueImaginary ? new Complex(0, value) : new Complex(value, 0));
        }

        // Handle real/imaginary base and Complex value
        if (typeof base === "number" && value instanceof Complex) {
            return logDivide(isBaseImaginary ? new Complex(0, base) : new Complex(base, 0), value);
        }

        // Handle real/imaginary base and real/imaginary value
        if (typeof base === "number" && typeof value === "number") {
            if (areBothImaginary) {
                return logDivide(new Complex(0, base), new Complex(0, value));
            }
            return logDivide(isBaseImaginary ? new Complex(0, base) : new Complex(base, 0), isValueImaginary ? new Complex(0, value) : new Complex(value, 0));
        }

        throw new Error("Invalid arguments for logarithm.");
    }

    static logModulus(num) {
        return Math.log(num.getMod());
    }

}

Object.seal(ComplexLog);