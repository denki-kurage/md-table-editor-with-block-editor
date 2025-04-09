import { BlockControls } from "@wordpress/block-editor";
import { ToolbarDropdownMenu } from "@wordpress/components";
import { DefaultCommandItems, ICommand, lightIconsMap } from "md-table-editor";
import React from "react";

type CommandKeyMap = typeof DefaultCommandItems;
type EditParam = {map: CommandKeyMap, commandMap: Map<string, ICommand>, isEnable: (name: string) => boolean}
export const EditToolbar = ({ map, commandMap, isEnable }: EditParam ) =>
{
	return (
		<BlockControls>
		{
			[...Object.entries(map)].map(([category, commandNames]) => {
				return (
					<ToolbarDropdownMenu
						label={category}
						text={category}
						icon={null}
						controls={
							commandNames.map( cmdName => {
								const cn = `${category}:${cmdName}`;
								const icon = lightIconsMap.get(cn);
								const execCmd = commandMap.get(cn)
								const action = () => execCmd?.execute();
								const isDisabled = !isEnable(cn);
								return {
									title: cmdName,
									icon: size => <img width={16} height={size} src={icon?.default} />,
									isDisabled,
									onClick: action
								}
							})
						}
						/>
				)
			})
		}
		</BlockControls>
	)
}

export default EditToolbar;
