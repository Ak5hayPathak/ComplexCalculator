import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';
import { ComplexPower } from './ComplexPower.js';
import { ComplexLog } from './ComplexLog.js';

export class ComplexTrigono {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexTrigono) {
            throw new Error("ComplexTrigono cannot be instantiated");
        }
    }

    static toDegrees(radians) {
        if (radians instanceof Complex) {
            return ComplexMath.divide(
                ComplexMath.multiply(radians, new Complex(180, 0)),
                new Complex(Math.PI, 0)
            );
        }
        else if (typeof radians === "number") {
            return (radians * 180.0) / Math.PI;
        }

        throw new Error("Input must be a number or an instance of Complex.");
    }

    static toRadian(degrees) {
        if (degrees instanceof Complex) {
            return ComplexMath.divide(
                ComplexMath.multiply(degrees, new Complex(Math.PI, 0)),
                new Complex(180, 0)
            );
        }
        else if (typeof degrees === "number") {
            return (degrees * Math.PI) / 180.0;
        }

        throw new Error("Input must be a number or an instance of Complex.");
    }

    static sin(num, isImaginary = false) {
        if (num instanceof Complex) {
            let expIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.IOTA, num));
            let expNegIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_IOTA, num));
            return ComplexMath.divide(ComplexMath.subtract(expIZ, expNegIZ), new Complex(0, 2));
        }
        else if (typeof num === "number") {
            return isImaginary ? this.sin(new Complex(0, num)) : new Complex(Math.sin(num), 0);
        }

        throw new Error("Input must be a number or an instance of Complex.");

    }

    static sinDegrees(num, isImaginary = false) {
        return this.sin(this.toRadian(num), isImaginary);
    }

    static cos(num, isImaginary = false) {
        if (num instanceof Complex) {
            let expIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.IOTA, num));
            let expNegIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_IOTA, num));
            return ComplexMath.divide(ComplexMath.add(expIZ, expNegIZ), 2.0);
        }
        else if (typeof num === "number") {
            return isImaginary ? this.cos(new Complex(0, num)) : new Complex(Math.cos(num), 0.0);
        }

        throw new Error("Invalid input: must be a Complex instance or a number.");
    }

    static cosDegrees(num, isImaginary = false) {
        return this.cos(this.toRadian(num), isImaginary);
    }

    static tan(num, isImaginary = false) {
        return ComplexMath.divide(this.sin(num, isImaginary), this.cos(num, isImaginary));
    }

    static tanDegrees(num, isImaginary = false) {
        return this.tan(this.toRadian(num), isImaginary);
    }

    static cot(num, isImaginary = false) {
        let tanValue = this.tan(num, isImaginary);
        if (tanValue.isZero()) {
            throw new Error("Cotangent is undefined for tan(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, tanValue);
    }

    static cotDegrees(num, isImaginary = false) {
        return this.cot(this.toRadian(num), isImaginary);
    }

    static sec(num, isImaginary = false) {
        let cosValue = this.cos(num, isImaginary);
        if (cosValue.isZero()) {
            throw new Error("Sec is undefined for cos(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, cosValue);
    }

    static secDegrees(num, isImaginary = false) {
        return this.sec(this.toRadian(num), isImaginary);
    }

    static cosec(num, isImaginary = false) {
        let sinValue = this.sin(num, isImaginary);
        if (sinValue.isZero()) {
            throw new Error("Cosecant is undefined for sin(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, sinValue);
    }

    static cosecDegrees(num, isImaginary = false) {
        return this.cosec(this.toRadian(num), isImaginary);
    }

    static arcSin(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(complexValue, complexValue)));
        let val = ComplexMath.add(ComplexMath.multiply(Complex.IOTA, complexValue), sqrtTerm);
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcSinDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSin(value, isValueImaginary));
    }

    static arcCos(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0.0, value) : new Complex(value, 0.0);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(complexValue, complexValue)));
        let val = ComplexMath.add(complexValue, ComplexMath.multiply(Complex.IOTA, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcCosDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCos(value, isValueImaginary));
    }

    static arcTan(value, isValueImaginary = false) {
        if (value.equals(new Complex(0, 1))) {
            throw new Error("arcTan is undefined for sqrt(-1)");
        }
        let val = ComplexMath.divide(
            ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(Complex.IOTA, value)),
            ComplexMath.add(Complex.ONE, ComplexMath.multiply(Complex.IOTA, value))
        );
        return ComplexMath.multiply(ComplexMath.divide(Complex.IOTA, 2.0), ComplexLog.ln(val));
    }

    static arcTanDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcTan(value, isValueImaginary));
    }

    static arcSec(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : value;
        if (z.getMod() < 1) {
            throw new Error("arcSec is undefined for |z| < 1");
        }
        let invZ = ComplexMath.divide(Complex.ONE, z);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(invZ, invZ)));
        let val = ComplexMath.add(invZ, ComplexMath.multiply(Complex.IOTA, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcSecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSec(value, isValueImaginary));
    }

    static arcCosec(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0.0, value) : new Complex(value, 0.0);
        if (complexValue.getMod() < 1) {
            throw new Error("arcCsc is undefined for |z| < 1");
        }
        let invZ = ComplexMath.divide(Complex.ONE, complexValue);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(invZ, invZ)));
        let val = ComplexMath.add(Complex.IOTA, ComplexMath.multiply(invZ, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcCosecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCosec(value, isValueImaginary));
    }

    static arcCot(value, isValueImaginary = false) {
        if (value instanceof Complex && value.isZero()) {
            throw new Error("arcCot is undefined for z = 0");
        }

        let complexValue = isValueImaginary ? new Complex(0, value) : value;
        let iZ = ComplexMath.multiply(Complex.IOTA, complexValue);
        let lnTerm = ComplexLog.ln(ComplexMath.divide(ComplexMath.add(Complex.ONE, iZ), ComplexMath.subtract(Complex.ONE, iZ)));

        return ComplexMath.multiply(new Complex(0, -0.5), lnTerm);
    }

    static arcCotDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCot(value, isValueImaginary));
    }
}

console.log(ComplexTrigono.arcCos(0.5).toString());

Object.seal(ComplexTrigono);