import { MonacoAppMain } from "../classes/MonacoAppMain";
import { Editor,  } from '@monaco-editor/react';
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import root from 'react-shadow';

import css2 from './table.dscss';


export const MonacoEditor = ({ value, onAppChanged, onValueChanged, onTablesChanged, onCurrentTableChanged }) =>
{
    const [app, setApp] = useState<MonacoAppMain>();

    useEffect(() => {
        if(app)
        {
            onAppChanged(app);
            return () => app?.dispose()            
        }
    }, [app]);

    return (
        <>

            <root.div className="monaco-shadow-dom">

                <style>{css2}</style>
                
                <link
                    rel="stylesheet"
                    type="text/css"
                    data-name="vs/editor/editor.main"
                    href="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.main.css"
                    />


                <Editor
                    width="100%"
                    height="100%"
                    defaultLanguage="markdown"
                    theme="vs-dark"
                    value={value}
                    onChange={e => {
                        //if(app && reciever) app.createRecieverWrapper().replace();
                        onValueChanged(e ?? '')
                    }}
                    onMount={(editor, monaco) =>{
                        const app = new MonacoAppMain(
                            editor,
                            monaco,
                            tables =>
                            {
                                onTablesChanged(tables);
                                //const value = app.model.getValue();
                                //onValueChanged(value);
                            },
                            currentTable =>
                            {
                                onCurrentTableChanged(currentTable);
                            }
                        );
                        setApp(app)
                    }}
                    />
                
            </root.div>


            


        </>
    )

}

export default MonacoEditor;
