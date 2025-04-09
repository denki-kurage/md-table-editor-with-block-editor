"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const MarkdownAlignments_1 = require("../../src/interfaces/MarkdownAlignments");
const MarkdownTableContent_1 = require("../../src/impls/MarkdownTableContent");
describe('MarkdownHelper', function () {
    // 典型的なサイド無しのライン
    it('split', () => {
        const line = "A|B|C";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        assert.equal(sl.cells[2].word, 'C');
        // length
        assert.equal(sl.cells.length, 3);
        // first/last
        assert.equal(sl.firstCell, null);
        assert.equal(sl.lastCell, null);
    });
    // firstが空文字で存在する場合
    it('spli2t', () => {
        const line = "|A|B|C";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        assert.equal(sl.cells[2].word, 'C');
        // length
        assert.equal(sl.cells.length, 3);
        // first/last の存在の有無
        assert.ok(sl.firstCell);
        assert.equal(sl.lastCell, null);
        // firstの情報
        assert.equal(sl.firstCell.word, '');
    });
    // lastが空文字で存在する場合
    it('split3', () => {
        const line = "A|B|C|";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        assert.equal(sl.cells[2].word, 'C');
        // length
        assert.equal(sl.cells.length, 3);
        // first/last の存在の有無
        assert.equal(sl.firstCell, null);
        assert.ok(sl.lastCell);
        // lastの情報
        assert.equal(sl.lastCell.word, '');
    });
    // last/first 共に存在
    it('split4', () => {
        const line = "|A|B|C|";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        assert.equal(sl.cells[2].word, 'C');
        // length
        assert.equal(sl.cells.length, 3);
        // first/last の存在の有無
        assert.ok(sl.firstCell);
        assert.ok(sl.lastCell);
        // firstの情報
        assert.equal(sl.firstCell.word, '');
        // lastの情報
        assert.equal(sl.lastCell.word, '');
    });
    // lastに文字列がある場合:firstなし
    it('split5', () => {
        const line = "A|B|C|x";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // length
        assert.equal(sl.cells.length, 3);
        // last
        assert.equal(sl.lastCell.word, 'x');
    });
    // lastに文字列がある場合:firstあり
    it('split6', () => {
        const line = "|A|B|C|x";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // length
        assert.equal(sl.cells.length, 3);
        // last
        assert.equal(sl.lastCell.word, 'x');
    });
    // lastの文字列内にスプリッタが存在する場合
    it('split7', () => {
        const line = "|A|B|C|x|y";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // length
        assert.equal(sl.cells.length, 3);
        // x|y last内にスプリッタがある場合
        assert.equal(sl.lastCell.word, 'x|y');
    });
    // 分割数が少ない場合: last無し
    it('split8', () => {
        const line = "A|B";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        // length
        assert.equal(sl.cells.length, 2);
        // first/last の存在の有無
        assert.equal(sl.firstCell, null);
        assert.equal(sl.lastCell, null);
    });
    // 分割数が少ない場合: last有
    it('split9', () => {
        const line = "A|B|";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        // text
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, 'B');
        // length
        assert.equal(sl.cells.length, 2);
        // first/last の存在の有無
        assert.equal(sl.firstCell, null);
        assert.equal(sl.lastCell, null);
    });
    it('whitespace cell count', () => {
        const line = "A| |C";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        assert.equal(sl.cells.length, 3);
        assert.equal(sl.cells[0].word, 'A');
        assert.equal(sl.cells[1].word, ' ');
    });
    it('whitespace cell count', () => {
        const line = "A| |C| |";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 4);
        assert.equal(sl.cells.length, 4);
        assert.equal(sl.cells[1].word, ' ');
        assert.equal(sl.cells[3].word, ' ');
    });
    it('split-a', () => {
        const line = "   |A|B|C|";
        const lines = MarkdownTableContent_1.MarkdownTableRows.split(line);
        const sl = MarkdownTableContent_1.MarkdownTableRows.adjust(lines, 3);
        assert.equal(sl.firstCell.word, '   ');
    });
    it('ba', () => {
        const line = "   |---|--:|:--|:-:|  ";
        const alignments = MarkdownTableContent_1.MarkdownTableAlignments.createInstance(line);
        assert.equal(alignments.cells.length, 4);
        assert.equal(alignments.cells[0].align, MarkdownAlignments_1.MarkdownAlignments.Left);
        assert.equal(alignments.cells[1].align, MarkdownAlignments_1.MarkdownAlignments.Right);
        assert.equal(alignments.cells[2].align, MarkdownAlignments_1.MarkdownAlignments.Left);
        assert.equal(alignments.cells[3].align, MarkdownAlignments_1.MarkdownAlignments.Center);
    });
    it('ba2', () => {
        const line = "   |---|--:|:--|:-:|-a-|  ";
        const alignments = MarkdownTableContent_1.MarkdownTableAlignments.createInstance(line);
        assert.equal(alignments, null);
    });
});
//# sourceMappingURL=MarkdownTableHelperTests.js.map