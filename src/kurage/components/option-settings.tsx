import apiFetch from "@wordpress/api-fetch";
import { Button, RangeControl, Spinner, TextControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import { store as noticeStore } from "@wordpress/notices";
import React, { useCallback, useEffect, useState } from "react";


const useSettings = () =>
{
    const [settings, setSettings] = useState<any>(false);

    const loadSettings = useCallback(async () => {
        
        if(settings === false)
        {
            setSettings(true);

            const result = await apiFetch({
                path: '/md-table-editor/v1/settings',
                method: 'GET'
            });

            // @ts-ignore
            if(!result?.data?.status)
            {
                setSettings(result);
                
                // ここ抜け忘れると無限ループする
                return;
            }

            setSettings(false);            
        }

    }, []);


    return [settings, loadSettings];
}

export const OptionSettings = ({ onCompleted }) =>
{
    const [settings, loadSettings] = useSettings();

    useEffect(() => {
        if(settings === false)
        {
            loadSettings();
        }
    }, [settings]);

    return (
        <div>
            { settings === true && <Spinner /> }
            { settings === false && <Button onClick={loadSettings}>再読み込み</Button> }
            { typeof settings !== "boolean" && <SettingsForm settings={settings} onCompleted={onCompleted} /> }
        </div>
    )
}


export const SettingsForm = ({ settings, onCompleted }) =>
{
    const [front, setFront] = useState(settings['front']);
    const [admin, setAdmin] = useState(settings['admin']);
    const [editorHeight, setEditorHeight] = useState(settings['editorHeight']);
    const [isLoading, setIsLoading] = useState(false);

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);

    const updateOptions = useCallback(async () =>
    {
        if(!isLoading)
        {
            setIsLoading(true);
            let result: any;

            try
            {
                result = await apiFetch({
                    path: '/md-table-editor/v1/settings',
                    method: 'POST',
                    data: {
                        admin,
                        front,
                        editorHeight
                    }
                })

                createSuccessNotice(__('updated', 'mdtableeditor'), { type: 'snackbar'})
                onCompleted(true)
            }
            catch(e)
            {
                createErrorNotice(e?.message ?? e, { type: 'snackbar'})
            }
            finally
            {
                setIsLoading(false);

            }

            return result;
        }

    }, [admin, front, editorHeight]);

    useEffect(() => { }, []);

    
    return (
        <div>
            <RangeControl
                label="default editor height"
                min={100}
                max={2000}
                value={editorHeight}
                onChange={setEditorHeight}
                />
            
            <TextControl value={front} onChange={setFront} label="front css" />
            <TextControl value={admin} onChange={setAdmin} label="admin css" />

            <Button disabled={isLoading} variant="primary" style={{width: '100%'}} onClick={() => updateOptions()}>{ __('Update', 'mdtableeditor')}</Button>

            <p>{ __('This will update the options used globally, but you will need to reload the page for the changes to take effect.', 'mdtableeditor') }</p>
        </div>
    )
}

export default OptionSettings;
