import { MarkdownRange } from "md-table-editor";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
import { sanitize } from "../classes/sanitizer";

export type AddBlogCardParams = 
{
    url: string;
    title: string;
    image: string;
}

export class AddBlogCardCommand extends MarkdownCommandBase<AddBlogCardParams>
{
    public execute(parameter?: AddBlogCardParams | undefined)
    {
        if(parameter)
        {
            const pos = this.appContext.getCursor();
            const replacer = this.appContext.getTextReplacer();
            const { url, title, image } = parameter;
            const host = new URL(url).host;
            
            const u = sanitize(url);
            const t = sanitize(title);
            const i = sanitize(image);
            const h = sanitize(host);

            const blogCard = [
                '<div class="blog-card">',
                    `<a href="${u}" target="_blank">`,
                        '<div>',
                            `<div>${t}</div>`,
                            `<span>${h}</span>`,
                        '</div>',
                        `<img src="${i}" />`,
                    '</a>',
                '</div>'
            ].join('');


            const p = pos?.docIndex ?? 0;
            replacer.replace(new MarkdownRange(p, p + 1), blogCard);
        }

        
    }

    public canExecute(parameter?: AddBlogCardParams | undefined): boolean
    {
        return true;
    }

}

