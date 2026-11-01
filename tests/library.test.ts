import { expect } from 'chai';
import { Library } from '../src/services/Library';

interface Item {
    id: string;
    name: string;
}

describe('Generic Library<T> Class Tests', () => {
    let lib: Library<Item>;

    beforeEach(() => {
        lib = new Library<Item>([
            { id: '1', name: 'Item One' },
            { id: '2', name: 'Item Two' },
        ]);
    });

    it('should correctly return all stored items', () => {
        expect(lib.getAll().length).to.equal(2);
    });

    it('should add a new item to collection', () => {
        lib.add({ id: '3', name: 'Item Three' });
        expect(lib.count()).to.equal(3);
        expect(lib.findById('3')?.name).to.equal('Item Three');
    });

    it('should find item by its ID', () => {
        const item = lib.findById('1');
        expect(item).to.not.be.undefined;
        expect(item?.name).to.equal('Item One');
    });

    it('should remove item by ID', () => {
        const removed = lib.remove('1');
        expect(removed).to.be.true;
        expect(lib.findById('1')).to.be.undefined;
        expect(lib.count()).to.equal(1);
    });
});