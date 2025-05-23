import { marked, Marked, Renderer, RendererObject, Parser } from "marked"
import { sanitize } from "../classes/sanitizer";

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

export const viewerMarkdown = (html: string) =>
{
    return mdparse(html);
}






type rendererType = keyof RendererObject;
const properites: Array<rendererType> = [
    "blockquote",
    "checkbox",
    "code",
    "heading",
    "hr",
    "list",
    "listitem",
    "paragraph",
    "space",
    "table",
    "tablecell",
    "tablerow",
    "html",
    "link",
    "image",
    "strong",
    "em",
    "codespan",
    "br",
    "del",
    "text"
]


const createRendererOptions = (renderer, dom: string[]) =>
{
    return properites.reduce((obj, property) => {
        obj[property] = (p) =>
        {
            const lineNumber = p?.lineNumber ?? 777;
            const html = renderer?.[property]?.(p);

            // @ts-ignore
            const div = window.top.document.createElement('div');
            div.innerHTML = html;
            const element: any = div.firstChild;

            if(element?.setAttribute)
            {
                element?.setAttribute("data-line-number", lineNumber);
                dom.push(div.innerHTML);
            }
            
            return false;
        }

        return obj;
    }, {})
}

const createMarked = (dom: string[] = []) =>
{
    const renderer = new Renderer();
    const parser = new Parser({ renderer });

    const md = new Marked();
    renderer.parser = parser;
    const rendererOptions = createRendererOptions(renderer, dom);

    md.use({
        renderer: rendererOptions
    })

    return md;
}

const getChildTokens = (token) =>
{
    const lst = token?.rows?.flat() ?? token?.items ?? token.tokens;
    return lst;
}

const recTokens = (offset, tokens) =>
{
    tokens.reduce((line, token) => {
        token.lineNumber = line;
        const cnt = token?.raw?.match(/\n/g)?.length ?? 1;
        return cnt + line;
    }, offset);

    for(const token of tokens)
    {
        const children = getChildTokens(token);
        if(children)
        {
            recTokens(token.lineNumber, children);
        }
    }
}

export const mdparse = (txt: string) =>
{
    const dom: string[] = [];
    const md = createMarked(dom);
    const tokens = md.lexer(txt);
    recTokens(0, tokens);

    const html = md.parser(tokens)
    console.log(html)
    console.log(dom)

    return dom.join("");
}



const getLineMap = (document) =>
{
    const lines = document.querySelectorAll('[data-line-number]') as any;
    return new Map([...lines.values()].map(line => {
        const top = document.body.scrollTop; //viewer.offsetTop + viewer.scrollTop;
        const pos = line.offsetTop;
        const dif = pos - top;
        const n = parseInt(line.getAttribute('data-line-number') || 0);
        return [n, [n, Math.abs(dif), pos]]
    })) as Map<number, [number, number, number]>;
}

export const registerMarkdownViewer = (document, lineChanged: (lineNumber: number) => void) =>
{
    document.addEventListener('scroll', e => {
        const top = document.body.scrollTop;
        const lineMap = getLineMap(document);
        const [nbr] = [...lineMap.values()].reduce(([newNbr, newDif], [nbr, dif, pos]) => {
            return dif < newDif ? [nbr, dif] : [newNbr, newDif];
        }, [0, Number.MAX_SAFE_INTEGER])
        const nxt = [...lineMap.keys()].filter(k => k > nbr).reduce((pre, cur) => Math.min(pre, cur), Number.MAX_SAFE_INTEGER);
        
        const nearLineNumber = lineMap.get(nbr);
        const nextLineNumber = lineMap.get(nxt);

        if(nearLineNumber && nextLineNumber)
        {
            const [nearNbr, , nearPos] = nearLineNumber;
            const [nextNbr, , nextPos] = nextLineNumber;
            const diff = (top - nearPos) / (nextPos - nearPos);
            const lin = Math.floor((nextNbr - nearNbr) * diff) + nearNbr;
            lineChanged(lin);
        }
        else
        {
            lineChanged(nearLineNumber?.[0] ?? 0)
            console.log(nearLineNumber?.[0])
        }
    });
}

export const getPositionFromLineNumber = (win, lineNumber: number) =>
{
    const lineMap = getLineMap(win.document);
    const numbers = [...lineMap.keys()];
    const minNumner = Math.max(...numbers.filter(n => n <= lineNumber));
    const maxNumber = Math.min(...numbers.filter(n => n >= lineNumber));

    const minPos = lineMap.get(minNumner)?.[2] ?? 0;
    const maxPos = lineMap.get(maxNumber)?.[2] ?? 0;

    const b = (lineNumber - minNumner + 1)  / (maxNumber - minNumner + 1) 
    const diff = (maxPos - minPos) * b + minPos;
    return diff;
}

export const scrollToLineNumber = (win: Window, lineNumber) =>
{
    if(win)
    {
        const pos = getPositionFromLineNumber(win, lineNumber);
        win.scrollTo({ top: pos, behavior: 'auto' });
    }
}





export type EventDisposable = () => void;

export class EventBlocker
{
    private isBlock = false;

    public constructor(private readonly label = 'None')
    {

    }

    public block(): EventDisposable
    {
        this.isBlock = true;
        return () => this.isBlock = false;
    }


    public blocking(execute: () => void): void
    {
        this.block();
        execute();
    }

    public fire(execute: () => void): void
    {
        if(!this.isBlocking())
        {
            execute();
        }

        this.clear();
    }

    public clear(): void
    {
        this.isBlock = false;
    }

    public isBlocking(): boolean
    {
        return this.isBlock;
    }

}



