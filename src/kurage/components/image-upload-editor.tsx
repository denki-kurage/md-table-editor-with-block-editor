import { MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import React, { useEffect, useMemo, useRef, useState } from 'react';


const ImagePreview = ({ url, thu }) =>
{

    return (
        <>
            { url && <a href={url} target="_blank"><img src={thu ?? url} /></a> }
        </>
    )
}

const ImageUploadEditor = ({ helper, onExecuted }) =>
{
    const [imageId, setImageId] = useState<number|undefined>(undefined);
    
    // @ts-ignore
    const img = useSelect(select => select('core').getMedia(imageId), [imageId]);
    const de = img?.media_details;
    const thu = de?.sizes?.medium?.source_url;
    const url = img?.source_url
    const width = de?.width;
    const height = de?.height;

    const prv = (
        <div style={{maxWidth: '50vh', maxHeight: '50vh', overflow: 'scroll' }}>
            <ImagePreview url={url} thu={thu} />
        </div>
    );

    const addImage = () =>
    {
        console.log(img)
        helper?.execCommand('markdown:add-image', {imageUrl: url, thumbnailUrl: thu, width, height });
        onExecuted();
    }
    
    return (
        <div>
            <MediaPlaceholder
                onSelect={e => setImageId(e.id)}
                mediaPreview={prv}
                />

            <Button disabled={imageId === undefined} variant="primary" onClick={() => addImage()}>
                追加する
            </Button>
        </div>
    )
}


export default ImageUploadEditor;

