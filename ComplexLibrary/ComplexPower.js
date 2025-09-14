import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';
import { ComplexLog } from './ComplexLog.js';

export class ComplexPower {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexPower) {
            throw new Error("ComplexPower cannot be instantiated");
        }
    }

    // e^(x + iy) = e^x * (cos(y) + i*sin(y))
    static expComplex(pow, isImaginary = false) {
        if (pow instanceof Complex) {
            let expReal = Math.exp(pow.real);
            return new Complex(expReal * Math.cos(pow.imag), expReal * Math.sin(pow.imag));
        }

        else if (typeof pow === "number" && isImaginary) {
            return new Complex(Math.cos(pow), Math.sin(pow));
        }

        else if (typeof pow === "number" && !isImaginary) {
            return new Complex(Math.exp(pow), 0);
        }

        throw new Error("Invalid arguments for exponent!");
    }

    static eulersFormula(pow, isImaginary = false) {
        if (pow instanceof Complex) {
            let temp = ComplexMath.multiply(Complex.IOTA, pow);
            return this.expComplex(temp);
        }

        else if (typeof pow === "number" && !isImaginary) {
            return new Complex(Math.cos(pow), Math.sin(pow));
        }

        else if (typeof pow === "number" && isImaginary) {
            return new Complex(Math.exp(-pow), 0);
        }

        throw new Error("Invalid arguments for euler's formula!");
    }

    static power(base, exponent, isBaseImaginary = false, isExponentImaginary = false) {
        if (!(base instanceof Complex) && typeof base !== "number") {
            throw new Error("Base must be a number or a Complex instance.");
        }
        if (!(exponent instanceof Complex) && typeof exponent !== "number") {
            throw new Error("Exponent must be a number or a Complex instance.");
        }

        let powComplex;

        if (base instanceof Complex && exponent instanceof Complex) {
            // (a+ib)^(c+id)
            powComplex = exponent;
        }
        else if (typeof base === "number" && exponent instanceof Complex) {
            // a^(c+id) or (ia)^(c+id)
            base = isBaseImaginary ? new Complex(0, base) : new Complex(base, 0);
            powComplex = exponent;
        }
        else if (base instanceof Complex && typeof exponent === "number") {
            // (a+ib)^c or (a+ib)^(ic)
            powComplex = isExponentImaginary ? new Complex(0, exponent) : new Complex(exponent, 0);
        }
        else if (typeof base === "number" && typeof exponent === "number") {
            // a^c, a^(ic), (ia)^c, or (ia)^(ic)
            base = isBaseImaginary ? new Complex(0, base) : new Complex(base, 0);
            powComplex = isExponentImaginary ? new Complex(0, exponent) : new Complex(exponent, 0);
        }
        else {
            throw new Error("Invalid arguments for power function.");
        }

        if (base.isZero() && powComplex.isZero()) {
            throw new Error("0 raised to the power 0 is undefined.");
        }
        else if (base.isZero()) {
            return new Complex();
        }

        return ComplexPower.expComplex(ComplexMath.multiply(powComplex, ComplexLog.ln(base)));
    }

    static sqrt(num) {
        if (num instanceof Complex) {
            return ComplexPower.power(num, 0.5);
        } else if (typeof num === "number") {
            return ComplexPower.power(new Complex(0, num), 0.5);
        }
        throw new Error("Invalid argument: sqrt expects a Complex number or a real number.");
    }

    static cbrt(num) {
        if (num instanceof Complex) {
            return ComplexPower.power(num, 1 / 3);
        } else if (typeof num === "number") {
            return ComplexPower.power(new Complex(0, num), 1 / 3);
        }
        throw new Error("Invalid argument: cbrt expects a Complex number or a real number.");
    }

    static nthRt(base, root, isBaseImaginary = false, isRootImaginary = false) {

        let getRoot = function (a, b) {
            if (b.isZero()) {
                throw new Error("Undefined root (division by zero)");
            }
            return ComplexPower.power(a, b.getReciprocal());
        }

        if (base instanceof Complex && root instanceof Complex) {
            return getRoot(base, root);
        }

        else if (base instanceof Complex && typeof root === "number") {
            return getRoot(base, new Complex(root, 0));
        }

        else if (base instanceof Complex && typeof root === "number", !isBaseImaginary, isRootImaginary) {
            return getRoot(base, new Complex(0, root));
        }

        else if (typeof base === "number" && root instanceof Complex, isBaseImaginary, !isRootImaginary) {
            return getRoot(new Complex(0, base), root);
        }

        else if (typeof base === "number" && typeof root === "number", isBaseImaginary, !isRootImaginary) {
            return getRoot(new Complex(0, base), new Complex(root, 0));
        }

        else if (typeof base === "number" && typeof root === "number", isBaseImaginary, isRootImaginary) {
            return getRoot(new Complex(0, base), new Complex(0, root));
        }

        else if (typeof base === "number" && root instanceof Complex) {
            return getRoot(new Complex(base, 0), root);
        }

        else if (typeof base === "number" && typeof root === "number", !isBaseImaginary, isRootImaginary) {
            return getRoot(new Complex(base, 0), new Complex(0, root));
        }

        else if (typeof base === "number" && typeof root === "number") {
            return getRoot(new Complex(base, 0), new Complex(root, 0));
        }

        throw new Error("Invalid arguments: nthRt expects combinations of Complex, Real, and Imaginary values.");
    }

    static sqrtAll(num, isImaginary = false) {
        let base;

        if (num instanceof Complex) {
            base = num;
        }
        else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        }
        else {
            throw new Error("Input must be an instance of Complex.");
        }

        let r = Math.sqrt(base.getMod()); // Square root of modulus
        let theta = base.getAngle(); // Argument (angle)

        let roots = [];
        for (let k = 0; k < 2; k++) {
            let angle = (theta + k * Math.PI) / 2.0; // Roots are π apart
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

    static cbrtAll(num, isImaginary = false) {
        let base;

        if (num instanceof Complex) {
            base = num;
        } else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        } else {
            throw new Error("Input must be a Complex instance or a number.");
        }

        let r = Math.cbrt(base.getMod()); // Cube root of modulus
        let theta = base.getAngle(); // Argument (angle)

        let roots = [];
        for (let k = 0; k < 3; k++) {
            let angle = (theta + (2 * Math.PI * k)) / 3.0; // Roots are 120° apart
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

    static nthRtAll(num, root, isImaginary = false) {
        if (!Number.isInteger(root) || root <= 0) {
            throw new Error("Root must be a positive integer.");
        }

        let base;

        if (num instanceof Complex) {
            base = num;
        } else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        } else {
            throw new Error("Input must be a Complex instance or a number.");
        }

        let r = Math.pow(base.getMod(), 1.0 / root); // Compute nth root of modulus
        let theta = base.getAngle(); // Compute argument (angle)

        let roots = [];
        for (let k = 0; k < root; k++) {
            let angle = (theta + (2 * Math.PI * k)) / root; // Correct nth root formula
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

}

// console.log(ComplexPower.nthRtAll(1, 3).toString());

Object.seal(ComplexPower);