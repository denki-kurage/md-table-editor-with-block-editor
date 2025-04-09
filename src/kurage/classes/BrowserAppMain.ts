import { __ } from '@wordpress/i18n';
import { AppMain, IAppContext, IDocumentPosition, IStringCounter, ITextSource, MarkdownRange, MarkdownTableContent, MultiEventRecievers, ITextReplacer, ITextEventReciever} from 'md-table-editor'
import { BrowserAppHelper } from './BrowserAppHelper';
import { IEditorDecorator } from 'md-table-editor/dist/interfaces/IAppContext';



export class BrowserAppMain extends AppMain<any> implements IAppContext
{

    protected registerTransmitter(reciever: ITextEventReciever): void
    {
        // この場でイベントを登録せず、以下の戻り値から送信する。
        // this.createTransmitterWrapper()

    }
    
    public readonly tableUpdated: Array<(tables: Array<MarkdownTableContent>) => void> = [];

    public constructor(private readonly dom: any)
    {
        super(null);
    }
    


    protected createTextReplacer(): ITextReplacer
    {
        const replace = (range, replaceText) => {
            const { begin, end } = range;
     
            const tx = this.dom.value ?? '';
            const b = BrowserAppHelper.lineToPosition(tx, begin)
            const e = BrowserAppHelper.lineToPosition(tx, end)
     
            // @ts-ignore
            this.dom.setRangeText(replaceText, b, e - 1, 'end');
            
            //const txt = tx.slice(0, b) + replaceText + tx.slice(e - 1);
            //this.settextCallback(txt);

            this.createTransmitterWrapper().replace()
            this.createTransmitterWrapper().select();
            //fireSelect(dom, app)
         };
         
         const select = (...selections) => {
            const selection = selections?.[0];
            const { sPos: s, ePos: e } = selection;
     
            const txt = this.dom.value ?? '';
            const start = BrowserAppHelper.toIndex(txt, s.docIndex, s.charIndex);
            const end = e ? BrowserAppHelper.toIndex(txt, e.docIndex, e.charIndex) : start;
     
            this.dom.setSelectionRange(start, end);
            this.dom.focus();

            this.createTransmitterWrapper().select();
         }
     
     
        return { replace, select }
    }

    public createTransmitterWrapper()
    {
        const dom = this.dom;

        const select = () =>
        {
            if(dom)
            {
                const e = BrowserAppMain.createRecieverEvent(dom.value, dom.selectionStart);
                this.reciever.selectChanged(e);
            }
        }
    
        const replace = () =>
        {
            if(dom)
            {
                const ce = BrowserAppMain.createRecieverEvent(dom.value, dom.selectionStart);
                this.reciever.textChanged(ce)
            }
        }

        return { select, replace }
    }



    protected createAppContext(): IAppContext
    {
        return this;
    }


    protected onTableUpdated(tables: Array<MarkdownTableContent>): void
    {
        for(const up of this.tableUpdated)
        {
            up(tables);
        }
    }

    





    //#region 

    public getText(): string
    {
        return this.dom.value;
    }
    
    public getCursor(): IDocumentPosition | undefined
    {
        const start = this.dom.selectionStart;
        const text = this.getText();
        

        const [docIndex, charIndex] = BrowserAppHelper.toPosition(text, start);
        return { docIndex, charIndex }
    }

    public returnKey(): string
    {
        return "\n";
    }

    public getAppConfig()
    {
        return {}
    }


    public getTextSource(): ITextSource | undefined
    {
        const text = this.getText();
        return ({
            hasLine: (line: number) =>
            {
                const lineCount = BrowserAppHelper.textLinesCount(text);
                return line >= 0 && line < lineCount;
            },
            lineAt: (line: number) =>
            {
                return BrowserAppHelper.textLines(text)?.[line] ?? ''
            }
        })
    }

    public getStringCounter(): IStringCounter
    {
        return str => str.length;
    }

    public getDecorator(): IEditorDecorator
    {
        return {
            decorate(table, docPos) {
                
            },
            clearDecorate() {
                
            },
        }
    }

    public scroll(docIndex: number): void
    {
        
    }

    //#endregion


    public static createRecieverEvent(text: string, position: number)
    {
        const [docIndex, charIndex] = BrowserAppHelper.toPosition(text, position);
        return { startPosition: { docIndex, charIndex }  }
    }
}
