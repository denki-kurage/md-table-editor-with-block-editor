"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const TextSource_1 = require("../../src/interfaces/TextSource");
const MarkdownParser_1 = require("../../src/app/MarkdownParser");
const fs_1 = require("fs");
const MarkdownTableContent_1 = require("../../src/impls/MarkdownTableContent");
describe("Test Suite 1", () => {
    it("1", () => {
        const text = "ABCDEFG".split('').join("\n");
        const ts = new TextSource_1.TextSource(text);
        const parser = new MarkdownParser_1.MarkdownParser();
        const txt = [...parser.parse(ts)].map(p => p.text || 'NULL').join('');
        assert.equal(txt, 'ABCDEFG');
    });
    it("111", () => {
        const rf = (0, fs_1.readFileSync)('./tests/resources/test.md', 'utf8');
        const text = rf.toString();
        const ts = new TextSource_1.TextSource(text);
        const parser = new MarkdownParser_1.MarkdownParser();
        let a = "";
        let b = "";
        for (const result of parser.parse(ts)) {
            if (result instanceof MarkdownTableContent_1.MarkdownTableContent) {
                a = result.headers.cells[0].word;
                b = result.rows[2].cells[1].word;
            }
        }
        assert.equal(a, 'A');
        assert.equal(b, 'p');
    });
});
//# sourceMappingURL=MarkdownParserTests.js.map