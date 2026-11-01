import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace Tests', () => {
    it('isNotEmpty should return true for non-empty string and false for empty', () => {
        expect(Validation.isNotEmpty('Book Title')).to.be.true;
        expect(Validation.isNotEmpty('   ')).to.be.false;
    });

    it('isValidNumericId should validate numeric characters only', () => {
        expect(Validation.isValidNumericId('1725533394038')).to.be.true;
        expect(Validation.isValidNumericId('id_123')).to.be.false;
        expect(Validation.isValidNumericId('abc')).to.be.false;
    });

    it('isValidYear should strictly validate 4-digit years within reasonable boundaries', () => {
        expect(Validation.isValidYear('2004')).to.be.true;
        expect(Validation.isValidYear('1999')).to.be.true;
        expect(Validation.isValidYear('99')).to.be.false;
        expect(Validation.isValidYear('3500')).to.be.false;
        expect(Validation.isValidYear('year')).to.be.false;
    });

    it('isValidEmail should validate email format', () => {
        expect(Validation.isValidEmail('test@gmail.com')).to.be.true;
        expect(Validation.isValidEmail('testgmail.com')).to.be.false;
    });
});