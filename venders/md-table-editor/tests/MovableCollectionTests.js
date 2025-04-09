"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const ICollectionMovable_1 = require("../src/interfaces/ICollectionMovable");
describe("MovableCollectionTests", () => {
    it('1', () => {
        const arr = 'ABCDEFG'.split('');
        const mv = new ICollectionMovable_1.MovableArray(arr);
        mv.move(3, [1, 5]);
        const mvd = mv.arr.join('');
        assert.equal(mvd, 'ACBFDEG');
    });
    it('2', () => {
        const arr = 'ABCDEFG'.split('');
        const mv = new ICollectionMovable_1.MovableArray(arr);
        const items = mv.getIndexItems([1, 5]);
        assert.equal(items.join(''), 'BF');
    });
    it('3', () => {
        const arr = 'ABCDEFG'.split('');
        const mv = new ICollectionMovable_1.MovableArray(arr);
        const removed = mv.removeIndexItems([1, 5]);
        assert.equal(removed.join(''), 'BF');
        assert.equal(arr.join(''), 'ACDEG');
    });
    it('4', () => {
        const arr = '0123456789'.split('');
        const mv = new ICollectionMovable_1.MovableArray(arr);
        mv.move(4, [1, 3, 5, 7, 9], 1);
        assert.equal(arr.join(''), '0241357968');
    });
    it('5', () => {
        const arr = '0123'.split('');
        const mv = new ICollectionMovable_1.MovableArray(arr);
        mv.move(2, [3]);
        assert.equal(arr.join(''), '0132');
    });
});
//# sourceMappingURL=MovableCollectionTests.js.map