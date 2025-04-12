import { Button, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { useCallback, useState } from "react";
import { ogpGenerator } from "../classes/OgpManager";
import { AddBlogCardParams } from "../commands/AddBlogCardCommand";



const BlogCardGenerator = ({ helper, onExecuted }) =>
{
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const addBlogCard = useCallback(async () =>
    {
        setLoading(true);

        const ogp = await ogpGenerator.add(url);

        if(ogp)
        {
            const { type, title, url, image } = ogp;
            const p: AddBlogCardParams = { url, title, image };
            helper?.execCommand('markdown:add-blog-card', p);
            onExecuted();
        }

        setLoading(false);
    }, [url]);

    return (
        <>
            <TextControl value={url} onChange={setUrl}  />

            <Button variant="primary" disabled={loading} onClick={() => addBlogCard()}>
                { __('Add blog card', 'md-table-editor') }
            </Button>
        </>
    )
}

export default BlogCardGenerator;