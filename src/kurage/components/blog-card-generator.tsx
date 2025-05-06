import { Button, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { useCallback, useState } from "react";
import { ogpGenerator } from "../classes/OgpManager";
import { AddBlogCardParams } from "../commands/AddBlogCardCommand";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";



const BlogCardGenerator = ({ helper, onExecuted }) =>
{
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { createErrorNotice } = useDispatch(noticesStore);


    const updateState = (url) =>
    {
        setUrl(url);
        setError('');
    }

    const addBlogCard = useCallback(async () =>
    {
        setLoading(true);

        try
        {
            const ogp = await ogpGenerator.add(url);
            const originUrl = url;

            if(ogp)
            {
                ogp.url = ogp?.url ?? originUrl;
                const { type, title, url, image } = ogp;

                if(!title || !url)
                {
                    throw new Error('title or url is empty');
                }

                const p: AddBlogCardParams = { url, title, image };
                helper?.execCommand('markdown:add-blog-card', p);
                onExecuted();
            }
        }
        catch(e)
        {
            const em = e.message ?? 'blog card load error';
            setError(em);
            createErrorNotice('blog card load error', { type: 'snackbar' })
        }

        setLoading(false);
    }, [url]);

    const style = error ? { borderColor: 'red', borderStyle: 'solid', borderWidth: 1 } : {};

    return (
        <>
            <TextControl value={url} onChange={updateState} style={style} help={error}  />

            <Button variant="primary" disabled={loading} onClick={() => addBlogCard()}>
                { __('Add blog card', 'md-table-editor-with-block-editor') }
            </Button>
        </>
    )
}

export default BlogCardGenerator;