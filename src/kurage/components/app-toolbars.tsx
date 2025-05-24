import { BlockControls } from "@wordpress/block-editor";
import { Modal, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import React, { useState } from "react";
import ImageUploadEditor from "./image-upload-editor";
import BlogCardGenerator from "./blog-card-generator";
import { __ } from "@wordpress/i18n";
import { AppMainHelper } from "../classes/AppMainHelper";

const AppToolbars = ({helper}: { helper: AppMainHelper }) =>
{
    const [imageOpen, setImageOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton icon="media-default" label={__('Add Image', 'mdtableeditor')} onClick={() => setImageOpen(true)} />
                    <ToolbarButton icon="archive" label={__('Add Blog Card', 'mdtableeditor')} onClick={() => setLinkOpen(true)} />
                </ToolbarGroup>
            </BlockControls>

            <ToolbarButtonModal title={__('Add Image', 'mdtableeditor')} isOpen={imageOpen} openChanged={setImageOpen}>
                <ImageUploadEditor helper={helper} onExecuted={setImageOpen} />
            </ToolbarButtonModal>

            <ToolbarButtonModal title={__('Add Blog Card', 'mdtableeditor')} isOpen={linkOpen} openChanged={setLinkOpen}>
                <BlogCardGenerator helper={helper} onExecuted={setLinkOpen} />
            </ToolbarButtonModal>
        </>
    );
}

const ToolbarButtonModal = ({children, isOpen, title, openChanged}) =>
{

    return (
        <>{ isOpen && <Modal style={{width: "60%"}} title={title} onRequestClose={e => openChanged(false)} children={children} /> }</>
    )
}

export default AppToolbars;

