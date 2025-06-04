import { Complex } from './Complex.js';
import { ComplexMath } from './ComplexMath.js';
import { ComplexPower } from './ComplexPower.js';
import { ComplexTrigono } from './ComplexTrigono.js';

export class ComplexGamma {
    // Lanczos coefficients for g=7, n=9 coefficients (common choice)
    static lanczosCoefficients = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    static g = 7;

    // Compute the Lanczos sum A_g(z)
    static lanczosSum(z) {
        let sum = new Complex(this.lanczosCoefficients[0], 0);

        for (let i = 1; i < this.lanczosCoefficients.length; i++) {
            // sum += c_i / (z + i)
            sum = ComplexMath.add(
                sum,
                ComplexMath.divide(
                    new Complex(this.lanczosCoefficients[i], 0),
                    ComplexMath.add(z, new Complex(i, 0))
                )
            );
        }
        return sum;
    }

    // Gamma function implementation using Lanczos approximation
    static gamma(z) {
        // Reflection formula for negative real part
        if (z.real < 0.5) {
            // π / (sin(πz) * Γ(1 - z))
            const pi = Math.PI;
            const piComplex = new Complex(pi, 0);

            const oneMinusZ = ComplexMath.subtract(new Complex(1, 0), z);
            const gammaOneMinusZ = ComplexGamma.gamma(oneMinusZ);
            const sinPiZ = ComplexTrigono.sin(ComplexMath.multiply(piComplex, z));

            return ComplexMath.divide(piComplex, ComplexMath.multiply(sinPiZ, gammaOneMinusZ));
        }

        z = ComplexMath.subtract(z, new Complex(1, 0));
        const x = ComplexGamma.lanczosSum(z);
        const t = ComplexMath.add(z, new Complex(this.g + 0.5, 0));

        const sqrtTwoPi = Math.sqrt(2 * Math.PI);
        const sqrtTwoPiComplex = new Complex(sqrtTwoPi, 0);

        // (t)^(z + 0.5)
        const powTerm = ComplexPower.power(t, ComplexMath.add(z, new Complex(0.5, 0)));
        // e^(-t)
        const expTerm = ComplexPower.expComplex(ComplexMath.multiply( Complex.NEG_ONE , t));

        return ComplexMath.multiply(
            ComplexMath.multiply(sqrtTwoPiComplex, powTerm),
            ComplexMath.multiply(expTerm, x)
        );
    }
}

console.log(ComplexGamma.gamma(new Complex("21")).toString());
Object.seal(ComplexGamma);
