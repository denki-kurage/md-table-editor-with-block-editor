import { MarkdownRange } from "md-table-editor";
import { MarkdownCommandBase } from "./MarkdownCommandBase";
import React from "react";

export interface AddImageCommandParams
{
    imageUrl: string;
    thumbnailUrl: string;
    width: number | undefined;
    height: number | undefined;
}

export class AddImageCommand extends MarkdownCommandBase<AddImageCommandParams>
{
    public execute(parameter: AddImageCommandParams)
    {
        const { imageUrl, thumbnailUrl, width, height } = parameter;
        const pos = this.appContext.getCursor();
        const replacer = this.appContext.getTextReplacer();

        const url = thumbnailUrl ?? imageUrl;
        const w = width ?? 100;
        const h = height ?? 100;


        /**
         * TODO: ここセキュリティ的にどうなん・・・？
         */
        const html = [
            `<figure>`,
            thumbnailUrl ? `<a href="${imageUrl}" target="_blank">` : '',
            `<img width="${w}" height="${h}" src="${url}" />`,
            thumbnailUrl ? `</a>` : '',
            `</figure>`
        ].join("")
        
        const p = pos?.docIndex ?? 0;
        replacer.replace(new MarkdownRange(p, p + 1), html);
    }

    public canExecute(parameter?: any): boolean
    {
        return true;
    }

}
