import { marked } from "marked"
import { sanitize } from "./classes/sanitizer";

marked.use({
    renderer: {
        code: (p) =>
        {
            const { lang, text, escaped } = p;
            if(lang)
            {
                const [lg, file] = lang.split(':');
                
                const code = escaped ? text : sanitize(text);
                const l = sanitize(lg ?? '');
                const f = sanitize(file ?? '');

                const label = f ? ` data-label="${f}"` : '';
                return `<pre${label}><code class="language-${l}">${code}</code></pre>`
            }

            
            return false;
        },
        link: (p) =>
        {
            const { href, text, title } = p;
            return `<a href="${href}" target="_blank">${text}</a>`;
        },
    }
})
export const parseMarkdown = (html: string) =>
{
    return marked(html, { breaks: true })
}
