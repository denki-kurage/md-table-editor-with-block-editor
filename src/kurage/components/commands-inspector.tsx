import { InspectorControls } from "@wordpress/block-editor";
import { Button, Modal, PanelBody, RangeControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { DefaultCommandItems, ICommand, lightIconsMap, MarkdownTableContent } from "md-table-editor";
import React, { useState } from "react";
import OptionSettings from "./option-settings";
import { __ } from "@wordpress/i18n";

const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

type CommandKeyMap = typeof DefaultCommandItems;
type EditParam = {map: CommandKeyMap, commandMap: Map<string, ICommand>, editHeight: number, onEditHeightChanged: (h: number | undefined) => void, isEnable: (name: string) => boolean}
type InspectorEditParam = { tables: Array<MarkdownTableContent>, current?: MarkdownTableContent } & EditParam;
export const CommandsInspector = ({ map, commandMap, tables, current, isEnable, editHeight, onEditHeightChanged  }: InspectorEditParam) =>
{
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const scrollCommand = commandMap.get('scroll');

    return (
        <InspectorControls>
            <PanelBody title="scroll">

                <div className="scroll-commands-panel">
                    { tables.map((table, index) => <TableView table={table} index={index} command={scrollCommand} />)}
                </div>
            </PanelBody>

            <PanelBody title="Commands">
                <style type="text/css">{iconDisabled}</style>

                <div>
                {
                    current && [...Object.entries(map)].map(([category, commandNames]) => {
                        return (
                            <>
                                <p>{category}</p>
                                <ToolbarGroup>
                                    {
                                    commandNames.map( cmdName => {
                                        const cn = `${category}:${cmdName}`
                                        const icon = lightIconsMap.get(cn);
                                        const execCmd = commandMap.get(cn)
                                        const action = () => execCmd?.execute();

                                        return <ToolbarButton
                                            title={cmdName}
                                            label={cn}
                                            icon={size => <img width={16} height={size} src={icon?.default} />}
                                            disabled={!isEnable(cn)}
                                            onClick={action}
                                            />
                                    })
                                    }
                                </ToolbarGroup>
                            </>
                        )
                    })
                }
                </div>
            </PanelBody>



            <PanelBody title="attributes">
                <div>
                    <RangeControl
                        label={ __(`Editor Height`, 'mdtableeditor') + (editHeight ? `(${editHeight})` : '') }
                        min={100}
                        max={2000}
                        withInputField={false}
                        value={editHeight}
                        allowReset={true}
                        onReset={e => onEditHeightChanged(undefined)}
                        onChange={e => onEditHeightChanged(e)}
                        />
                </div>
            </PanelBody>

            <PanelBody title="settings">

                <div>
                    <Button variant="primary" disabled={isSettingsOpen} onClick={() => setIsSettingsOpen(true)}>
                        { __('Open settings from', 'mdtableeditor') }
                    </Button>
                    { isSettingsOpen && (
                        <Modal title={ __('global settings', 'mdtableeditor') } onRequestClose={e => setIsSettingsOpen(false)}>
                            <OptionSettings onCompleted={e => setIsSettingsOpen(false)} />
                        </Modal>
                    )}
                </div>

            </PanelBody>


        </InspectorControls>
    )
}

export const TableView = ({table, command, index}: {table: MarkdownTableContent, command?: ICommand, index: number}) =>
{
    const label = table.headers.cells.map(h => h.word).join(', ')
    const onClick = () =>
    {
        command?.execute(index);
    }

    return (
        <Button variant="secondary" className="scroll-command-item" onClick={e => onClick()}>{ label }</Button>
    )
}

export default CommandsInspector;