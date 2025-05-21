import { Monaco } from "@monaco-editor/react";
import { editor, IDisposable, IRange, languages, Position } from 'monaco-editor';
import { AppMain, IAppContext, ICommand, ITextEventReciever, ITextReplacer, MarkdownTableContent, TableCacheManager } from "md-table-editor";
import { MonacoDecorator } from "./MonacoDecorator";
import { AddImageCommand } from "../commands/AddImageCommand";
import { AddBlogCardCommand } from "../commands/AddBlogCardCommand";

interface MonacoInitParam
{
    editor: editor.IStandaloneCodeEditor;
    monaco: Monaco;
}

export class MonacoAppMain extends AppMain<MonacoInitParam>
{
    private decorator: MonacoDecorator;
    public get model(): editor.ITextModel
    {
        const m = this.editor.getModel();
        if(!m)
        {
            throw new Error("")
        }
        return m;
    }

    public constructor(
        public readonly editor: editor.IStandaloneCodeEditor,
        public readonly monaco: Monaco,
        private readonly updated: (tables: Array<MarkdownTableContent>) => void,
        private readonly currentTableUpdated: (current? : MarkdownTableContent) => void
    )
    {
        super({ editor, monaco });
        this.decorator = new MonacoDecorator(this.appContext, editor);
        this.switcher.decoratorSwitcher.changeEnable(true);

        monaco.languages.registerCompletionItemProvider(
            'markdown',
            {
                triggerCharacters: ['x'],
                provideCompletionItems: (model, pos, content, token) =>
                {
                    if(pos.column === 3)
                    {
                        const txt = model.getLineContent(pos.lineNumber).substring(0, 2);
                        const nbr = Number(txt.charAt(0));
    
                        if(!isNaN(nbr) && txt.charAt(1) === 'x')
                        {
                            const items = [...Array(9).keys()].map(_ => {
    
                                const len = _ + 1;
                                const line = '|' + 'x'.repeat(nbr).split('').join('|') + '|';
                                const row = line.replace(/x/g, '   ');
                                const alignment = line.replace(/x/g, '---');
    
                                const table = [
                                    row,
                                    alignment,
                                    ...[...Array(len).keys()].map(_ => row)
                                ]
                                
                                // TODO: 改行コードってそのまま挿入するのまずそう、フォーマッターもそうだけど、検証が必要。
                                .join("\n");
    
                                const doc = table.replace(/   /g, ' A ');
    
                                return <languages.CompletionItem>{
                                    label: `${nbr}x${len}`,
                                    kind: monaco.languages.CompletionItemKind.Snippet,
                                    detail: `Create a new table.`,
                                    documentation: doc,
                                    insertText: table
                                };
                            });
                            return { suggestions: items };
                        }
                    }
                }
            }
        )

        
    }

    protected override createCommands(appContext: IAppContext, cache: TableCacheManager): Map<string, ICommand> 
    {
        const commands = super.createCommands(appContext, cache);
        commands.set('markdown:add-image', new AddImageCommand(appContext));
        commands.set('markdown:add-blog-card', new AddBlogCardCommand(appContext));

        return commands;
    }

    protected override onFormatRequest(): void
    {
        super.onFormatRequest();
    }

    protected override onTableUpdated(tables: MarkdownTableContent[]): void
    {
        this.updated(tables);
        super.onTableUpdated(tables);
    }

    protected override onCurrentTableChanged(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined): void
    {
        super.onCurrentTableChanged(nv, ov);
        this.currentTableUpdated(nv);
    }

    protected createAppContext(): IAppContext
    {
        return {

            getCursor: () =>
            {
                const selection = this.editor.getSelection();

                if(selection)
                {
                    return {
                        docIndex: selection.positionLineNumber - 1,
                        charIndex: selection.positionColumn - 1
                    }
                }
            },
            getText: () =>
            {
                return this.editor.getValue();
            },
            getTextSource: () =>
            {
                return {
                    lineAt: (line: number) =>
                    {
                        return this.model.getLineContent(line + 1);
                    },
                    hasLine: (line: number) =>
                    {
                        const count = this.model.getLineCount();
                        return line >= 0 && line < count 
                    }
                }
            },
            getTextReplacer: () =>
            {
                return this.createTextReplacer();
            },
            getStringCounter: () =>
            {
                return str => {
                    let len = 0;
                    let strSrc = escape(str);
                    for(let i = 0; i < strSrc.length; i++, len++){
                        if(strSrc.charAt(i) === "%"){
                            if(strSrc.charAt(++i) === "u"){
                                i += 3;
                                len++;
                            }
                            i++;
                        }
                    }
                    return len;
                }
            },
            getAppConfig: () =>
            {
                return {}
            },
            returnKey: () =>
            {
                return this.initParam.editor.getModel()?.getEOL() ?? "\n";
            },
            getDecorator: () =>
            {
                return {
                    decorate: (table, docPos) =>
                    {
                        this.decorator.decorate(table, docPos);
                    },
                    clearDecorate: () =>
                    {
                        this.decorator.clear();
                    },
                }
            },

            scroll: (docIndex: number) =>
            {
                this.editor.revealLine(docIndex + 1, editor.ScrollType.Smooth);
            }
        }
    }

    protected createTextReplacer(): ITextReplacer
    {
        
        return {
            replace: (range, txt) =>
            {
                const { begin, end } = range;
                const content = this.model.getLineContent(end);

                const r: IRange =
                {
                    startLineNumber: begin + 1,
                    endLineNumber: end,
                    startColumn: 1,
                    endColumn: content.length + 1
                }
                
                /*
                this.editor.executeEdits(
                    '',
                    [
                        { text: txt, range: r }
                    ]
                )
                */

                this.model.applyEdits([{
                    forceMoveMarkers: false,
                    text: txt,
                    range: r
                }]);

            },
            select: (...selections) =>
            {
                const newSelections = selections.map(s => {
                    const { docIndex: selectionStartLineNumber, charIndex: selectionStartColumn } = s.sPos;
                    const { docIndex: positionLineNumber, charIndex: positionColumn } = s.ePos ?? {...s.sPos};
                    return {
                        selectionStartLineNumber: selectionStartLineNumber + 1,
                        selectionStartColumn: selectionStartColumn + 1,
                        positionLineNumber: positionLineNumber + 1,
                        positionColumn: positionColumn + 1
                    };
                })
                this.editor.setSelections(newSelections);
                this.editor.focus();
            },
        }
    }
    
    protected registerTransmitter(reciever: ITextEventReciever): void
    {
        this.initParam.editor.getModel()?.onDidChangeContent(e => {
            const { startColumn, startLineNumber } = e.changes[0].range;
            reciever.textChanged({ startPosition: { docIndex: startLineNumber, charIndex: startColumn } });
        })

        this.initParam.editor.onDidChangeCursorSelection(e => {
            const { startColumn, startLineNumber } = e.selection;
            reciever.selectChanged({ startPosition: { docIndex: startLineNumber, charIndex: startColumn } });
        })
    }


    
    //#region
    private monacoDisposables: IDisposable[] = [];

    public scroll(lineNumber: number)
    {
        const ln = this.editor.getVisibleRanges()?.[0].startLineNumber;
        if(lineNumber !== ln)
        {
            const pos = this.editor.getTopForPosition(lineNumber + 1, 1);
            this.editor.setScrollTop(pos, editor.ScrollType.Immediate);
        }
    }

    public addScrollEventListener(scrolled: (lineNumber: number) => void)
    {
        this.monacoDisposables.push(this.editor.onDidScrollChange(e => {
            const ln = this.editor.getVisibleRanges()?.[0].startLineNumber;
            if(ln)
            {   
                scrolled(ln - 1)
            }
        }))
    }
    //#endregion



    public override dispose(): void
    {
        this.monacoDisposables.forEach(d => d.clear());
    }
}

