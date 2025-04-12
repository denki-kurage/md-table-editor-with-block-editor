
import { useBlockProps } from '@wordpress/block-editor';
import { parseMarkdown } from './parser';

export const save = ({attributes}) =>
{
	const { markdown } = attributes;
	const html = parseMarkdown(markdown);

	return <div { ...useBlockProps.save({ className: 'markdown-content-style' }) } dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default save;
