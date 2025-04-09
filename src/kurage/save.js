
import { useBlockProps } from '@wordpress/block-editor';
import { marked } from 'marked';

export const save = ({attributes}) =>
{
	const { markdown } = attributes;
	const html = marked.parse(markdown, { breaks: true });

	return <div { ...useBlockProps.save({ className: 'markdown-content-style' }) } dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default save;
