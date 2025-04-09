"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const TextSource_1 = require("../../src/interfaces/TextSource");
const MarkdownParser_1 = require("../../src/app/MarkdownParser");
describe("Test Suite 1", () => {
    it('format', () => {
        const rf = (0, fs_1.readFileSync)('./tests/resources/test.md', 'utf8');
        const text = rf.toString();
        const ts = new TextSource_1.TextSource(text);
        const parser = new MarkdownParser_1.MarkdownParser();
        const table = parser.findContent(ts, 5);
    });
});
//# sourceMappingURL=MarkdownTableFormatterTests.js.map