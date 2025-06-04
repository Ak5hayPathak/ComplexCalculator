import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';
import { ComplexPower } from './ComplexPower.js';
import { ComplexLog } from './ComplexLog.js';

export class ComplexHyperbolic {

    constructor() {
        if (new.target === ComplexHyperbolic) {
            throw new Error("ComplexHyperbolic cannot be instantiated");
        }
    }

    static sinh(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z instanceof Complex) {
            let expZ = ComplexPower.expComplex(z);
            let expNegZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_ONE, z));
            return ComplexMath.divide(ComplexMath.subtract(expZ, expNegZ), 2.0);
        }
        throw new Error("Input must be a number or Complex instance.");
    }

    static cosh(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z instanceof Complex) {
            let expZ = ComplexPower.expComplex(z);
            let expNegZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_ONE,z));
            return ComplexMath.divide(ComplexMath.add(expZ, expNegZ), 2.0);
        }
        throw new Error("Input must be a number or Complex instance.");
    }

    static tanh(z, isImaginary = false) {
        let sinhZ = this.sinh(z, isImaginary);
        let coshZ = this.cosh(z, isImaginary);
        if (coshZ.isZero()) {
            throw new Error("Tanh is undefined for cosh(z) = 0");
        }
        return ComplexMath.divide(sinhZ, coshZ);
    }

    static coth(z, isImaginary = false) {
        let tanhZ = this.tanh(z, isImaginary);
        if (tanhZ.isZero()) {
            throw new Error("Coth is undefined for tanh(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, tanhZ);
    }

    static sech(z, isImaginary = false) {
        let coshZ = this.cosh(z, isImaginary);
        if (coshZ.isZero()) {
            throw new Error("Sech is undefined for cosh(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, coshZ);
    }

    static cosech(z, isImaginary = false) {
        let sinhZ = this.sinh(z, isImaginary);
        if (sinhZ.isZero()) {
            throw new Error("Cosech is undefined for sinh(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, sinhZ);
    }

    static arcSinh(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        let insideSqrt = ComplexMath.add(ComplexMath.multiply(z, z), Complex.ONE);
        let sqrtTerm = ComplexPower.sqrt(insideSqrt);
        return ComplexLog.ln(ComplexMath.add(z, sqrtTerm));
    }

    static arcCosh(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        let insideSqrt = ComplexMath.subtract(ComplexMath.multiply(z, z), Complex.ONE);
        let sqrtTerm = ComplexPower.sqrt(insideSqrt);
        return ComplexLog.ln(ComplexMath.add(z, sqrtTerm));
    }

    static arcTanh(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z.equals(Complex.ONE) || z.equals(ComplexMath.multiply(Complex.NEG_ONE,Complex.ONE))) {
            throw new Error("artanh is undefined for ±1");
        }
        let onePlusZ = ComplexMath.add(Complex.ONE, z);
        let oneMinusZ = ComplexMath.subtract(Complex.ONE, z);
        return ComplexMath.multiply(0.5, ComplexLog.ln(ComplexMath.divide(onePlusZ, oneMinusZ)));
    }

    static arcCoth(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z.equals(Complex.ONE) || z.equals(ComplexMath.multiply(Complex.NEG_ONE,Complex.ONE))) {
            throw new Error("arcCoth is undefined for ±1");
        }
        let zPlus1 = ComplexMath.add(z, Complex.ONE);
        let zMinus1 = ComplexMath.subtract(z, Complex.ONE);
        return ComplexMath.multiply(0.5, ComplexLog.ln(ComplexMath.divide(zPlus1, zMinus1)));
    }

    static arcSech(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z.isZero()) {
            throw new Error("arcSech is undefined for z = 0");
        }
        let oneOverZ = ComplexMath.divide(Complex.ONE, z);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(ComplexMath.multiply(oneOverZ, oneOverZ), Complex.ONE));
        return ComplexLog.ln(ComplexMath.add(oneOverZ, sqrtTerm));
    }

    static arcCosech(z, isImaginary = false) {
        if (typeof z === "number") {
            z = isImaginary ? new Complex(0, z) : new Complex(z, 0);
        }
        if (z.isZero()) {
            throw new Error("arcCosech is undefined for z = 0");
        }
        let oneOverZ = ComplexMath.divide(Complex.ONE, z);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.add(oneOverZ.multiply(oneOverZ), Complex.ONE));
        return ComplexLog.ln(ComplexMath.add(oneOverZ, sqrtTerm));
    }
}

Object.seal(ComplexHyperbolic);
