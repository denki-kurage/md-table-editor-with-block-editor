import { marked, Tokens } from "marked"
import { sanitize } from "./classes/sanitizer";

marked.use({
    renderer: {
        code: (p) =>
        {
            const { lang, text, escaped } = p;
            const lg = lang ?? '';
            if(lg.includes(':'))
            {
                const [lang, file] = lg.split(':');
                const code = escaped ? text : sanitize(text);
                const l = sanitize(lang ?? '');
                const f = sanitize(file ?? '');
                const label = f ? ` data-label="${f}"` : '';
                return `<pre${label}><code class="language-${l}">${code}</code></pre>`
            }

            
            return false;
        },
        link: (p) =>
        {
            const { href, text, title } = p;
            console.log(p);
            return `<a href="${href}" target="_blank">${text}</a>`;
        },
    }
})
export const parseMarkdown = (html: string) =>
{
    return marked(html, { breaks: true })
}
