import React, { useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { Button, PanelBody, Spinner } from '@wordpress/components';

import {  DefaultCommandItems, EventUpdateManager, MarkdownTableContent } from 'md-table-editor'
import MonacoEditor from './components/monaco-editor';
import { MonacoAppMain } from './classes/MonacoAppMain';
import CommandsInspector from './components/commands-inspector';
import EditToolbar from './components/edit-toolbar';
import { AppMainHelper } from './classes/AppMainHelper';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { registerMarkdownViewer, viewerMarkdown, scrollToLineNumber, EventBlocker } from './components/parser';
import AppToolbars from './components/app-toolbars';
import { LineNumberContextProvider } from './line-number-context';


//import Prism from 'prismjs'

const str = `
| fruits | price | color  | pr |
|--------|-------|--------|----|
| apple  | 200   | red | 1  |
 grape  | 1200  | purple | 22 |
| banana | 160   | yellow | 3  |ff
| melon  | 2000  | green  | 51 |
`;

type EditMode = "code"|"view"|"both";
export default ({ attributes, setAttributes }) =>
{
	const { markdown, viewMode, splitSize, editHeight } = attributes;

	const [app, setApp] = useState<MonacoAppMain>();
	const [tables, setTables] = useState<MarkdownTableContent[]>([]);
	const [currentTable, setCurrentTable] = useState<MarkdownTableContent|undefined>();
	const [lineNumber, setLineNumber] = useState(0);
	const [win, setWin] = useState<Window|undefined>();

	const helper = useMemo(() => app ? new AppMainHelper(app) : undefined, [app]);
	const enabledCommandNames = helper?.enabledCommandNames ?? [];

	const x = useMemo(() => (app && win) ? useEditorInterlocking(app, win) : undefined, [app, win]);
	
	const onPanelChange = (viewMode: EditMode) =>
	{
		setAttributes({viewMode});
	}

	const onCodeChanged = (markdown: string) =>
	{
		setAttributes({ markdown })
	}



	const isBoth = viewMode === 'both';
	const both = { width: "50%" };
	const full = { width: "100%" };
	const none = { display: "none" };
	const styles = isBoth ? [both, both] : (viewMode === 'code' ? [full, none] : [none, full]);
	

	return (
		<div { ...useBlockProps() }>
			<LineNumberContextProvider value={{lineNumber, updateLineNumber: setLineNumber}}>
				<div>MdTableEditor with Block Editor</div>

				<InspectorControls>
					<PanelBody title="操作パネル">
						<div className="button-group" >
							<Button variant="primary" disabled={viewMode === "code"} onClick={() => onPanelChange("code")}>{ __('Code', 'mdtableeditor') }</Button>
							<Button variant="primary" disabled={viewMode === "view"} onClick={() => onPanelChange("view")}>{ __('View', 'mdtableeditor') }</Button>
							<Button variant="primary" disabled={viewMode === "both"} onClick={() => onPanelChange("both")}>{ __('Both', 'mdtableeditor') }</Button>
						</div>
					</PanelBody>
				</InspectorControls>


				{ helper && <AppToolbars helper={helper} /> }
						

				<SplitPanel height={editHeight}>
					<Panel style={styles[0]}>
						<MonacoEditor
							value={markdown}
							onValueChanged={onCodeChanged}
							onAppChanged={setApp}
							onCurrentTableChanged={setCurrentTable}
							onTablesChanged={setTables}
							/>
					</Panel>
					<Panel style={styles[1]}>
						{ app && <MarkdownViewer
							value={markdown}
							setWindow={setWin}
							/>
						}
					</Panel>
				</SplitPanel>

				{ (helper && currentTable) && 
					<EditToolbar
						map={DefaultCommandItems}
						commandMap={helper.commands}
						isEnable={c => enabledCommandNames.includes(c)}
						/>
				}

				{ helper &&
					<CommandsInspector
						map={DefaultCommandItems}
						commandMap={helper.commands}
						isEnable={c => enabledCommandNames.includes(c)}
						tables={tables}
						current={currentTable}
						editHeight={editHeight}
						onEditHeightChanged={editHeight => setAttributes({editHeight: editHeight || null})}
						/>
				}
				
			</LineNumberContextProvider>
		</div>

	)
}


const MarkdownViewer = ({value, setWindow}: { value: string, setWindow: (win: Window) => void }) =>
{
	const frameRef = useRef(null);
	const valueRef = useRef(value);

	const [isLoading, setIsLoading] = useState(false);
	const [updateManager, setUpdateManager] = useState<EventUpdateManager|undefined>(undefined);


	useEffect(() => {
		valueRef.current = value;
		updateManager?.lazyUpdate();
		setIsLoading(true);
	}, [value]);


	useEffect(() => {
		// @ts-ignore
		const win = frameRef?.current.contentWindow;
		setWindow(win);
	}, [frameRef.current])


	useEffect(() => {
		const updater = new EventUpdateManager(800);
		updater.updated.push(() =>
		{

			const value = valueRef.current;

			//
			// xxxxxxxxxxxxxxxxxx
			//
			//const parsedCode = parseMarkdown(value);
			const parsedCode = viewerMarkdown(value);

			const html = `<div class="markdown-content-style">${parsedCode}</div>`;

			const iframe = frameRef.current;
			// @ts-ignore
			const doc = (iframe?.contentDocument ?? iframe?.contentWindow.document);

			if(doc)
			{
				doc.body.innerHTML = html;

				// @ts-ignore
				window.Prism.highlightAllUnder(doc);

				if(!doc.head.hasChildNodes())
				{
					const scripts = [
					//'<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />',
					//'<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />',
					//'<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>',
					//'<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>'
					].join("\n");
					
					const createLink = (link: string) =>
					{
						const elm = document.createElement("link");
						Object.entries({ rel: 'stylesheet', type: "text/css", href: link }).map(p => elm.setAttribute(...p))
						return elm;
					}
					const fragment = doc.createDocumentFragment();
					const metas = [...window.document.querySelectorAll('meta[property="is-markdown-content-style"], meta[content^=http]')];
					// @ts-ignore
					metas.map(meta => fragment.appendChild(createLink(meta.content)));

					doc.head.innerHTML = scripts;
					doc.head.appendChild(fragment);					
				}

			}

			setIsLoading(false);
		});

		updater.lazyUpdate();
		setUpdateManager(updater);

		return () => updater.dispose();
	}, []);


	
	return (
		<div>
			<iframe className='width-panel' ref={frameRef}></iframe>
			<Loading isLoading={isLoading} />
		</div>
	)
}

const Loading = ({isLoading}) =>
{
	const style: any = {
		position: 'absolute',
		top: 0,
		width: "100%",
		height: "100%",
	};

	return (
		<>
			{ isLoading &&
				<>
				<div style={{...style, opacity: 0.5, backgroundColor: "white"}}></div>
				<div style={{...style, alignContent: "center", textAlign: "center"}}>
					<Spinner style={{width: 100, height: 100}} />
				</div>
				</>
			}
		</>
	)
}


const SplitPanel = ({children, height}) =>
{
    // @ts-ignore
    const post: any = useSelect(select => select(editorStore).getCurrentPost(), []);

	const style = { height: height ?? post?.md_table_editor_height ?? undefined };

	return (
		<div className="md-table-editor split-panel" style={style}>
			{children}
		</div>
	)
}

const Panel = ({children, style}) =>
{


	return (
		<div className="width-panel" style={style}>
			{children}
		</div>
	)
}



const useEditorInterlocking = (app: MonacoAppMain, win: Window) =>
{
	const editorBlocker = new EventBlocker('Editor');
	const viewerBlocker = new EventBlocker('Viewer');

	const fs = {
		reveal: (lineNumber: number) => editorBlocker.blocking(() => app.scroll(lineNumber)),
		scroll: (lineNumber: number) => viewerBlocker.blocking(() => scrollToLineNumber(win, lineNumber))
	};

	app.addScrollEventListener(lineNumber => editorBlocker.fire(() => fs.scroll(lineNumber)));
	registerMarkdownViewer(win.document, lineNumber => viewerBlocker.fire(() => fs.reveal(lineNumber)));

}

