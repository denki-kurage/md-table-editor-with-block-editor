# MdTableEditor with WordPress Block Editor

You can edit tables written in Markdown with the block editor.

Originally created as a VSCode extension, MdTableEditor has been ported to WordPress.

Below is the VSCode extension MdTableEditor

https://marketplace.visualstudio.com/items?itemName=clover.md-table-editor


## What it can do.

This block allows you to create and edit tables in Markdown format.

It allows you to do all the editing of Markdown tables, such as adding, deleting, and moving columns and rows, and aligning and shaping text.

You can also use Markdown notations other than tables, but at present this is not practical for things like adding links or highlighting source code.

It is intended solely for editing tables.


## How to use

For basic usage, please see MdTableEditor (some functions may not be available).

https://marketplace.visualstudio.com/items?itemName=clover.md-table-editor

![](md-add.png)

Adds a block editor.

![](md-init.png)

Added state.

![](md-i.png)

You can use the completion function by entering `4x` in the first column of a line.

![](md-i-2.png)

Executing `4x4` creates a table with four rows and four columns.
If you want to display the view, press ``ctrl` + space`` during completion.


![](md-sample.png)

A sample table.
The editor used in VSCode is on the left, and the confirmation screen is on the right.

![](md-image.png)

This is a block editor specialized for table editing, but you can add images at a minimum.

![](md-image-2.png)

You can see the image displayed on the confirmation screen.

![](md-mode-view.png)

When the editor mode is set to view, only the confirmation screen is displayed.

![](md-mode-code.png)

When the editor mode is set to code, only the editor is displayed.

![](md-scroll.png)

When there are multiple tables in the markdown, they are listed, and you can scroll to the tables by clicking the button.



![](md-height.png)

You can set the height of the editor individually.

If you disable the height setting here, the default height will be used.

The default setting is set in the following global settings.

![](md-global-settings.png)

In the global settings, you can set the settings that would normally be done in the admin screen from the inspector.

You can set the default height of the editor and the style sheet of the HTML that Markdown outputs.

- Default editor height
- Block editor confirmation screen style
- Front-end style


## Specify the Markdown style.

You can set the style from the global settings.

The Markdown DOM is placed under `div.markdown-content-style` on both the frontend and backend.

Therefore, design it in SASS as follows.


    markdown.scss

```scss
.markdown-content-style
{

    TABLE
    {
        width: 100%;
    }

    TABLE, TH, TD
    {
        border: 1px solid rgb(210, 210, 210);
        border-collapse: collapse;
        padding: .3em;
    }

    TH
    {
        background-color: rgb(227, 227, 227);

        // THはデフォルトでCENTERに並ぶので、--- だと中央に位置してしまいます。
        // それでは実態と異なるので ---指定の場合はCSSレベルで左寄せします。
        // 
        // ---  ->  <TH>
        // :--  ->  <TH align="left">
        &:not([align])
        {
            text-align: left;
        }
    }

    TD
    {
        background-color: rgb(246, 246, 246);
    }
}
```

This is the style used by default.
After converting it to CSS and placing it on the web, you can change the Markdown style by specifying it in the global settings.

## Requests, etc.

I may respond to your requests if I feel like it!
I am an amateur programmer with no practical experience, so I cannot handle difficult requirements.

## About the developer

I do C# as a hobby!

