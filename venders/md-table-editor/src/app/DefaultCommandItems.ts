
const lightIcons = [
    require('../../resources/icons/format/light/fill-cells.svg'),
    require('../../resources/icons/format/light/beautiful.svg'),
    require('../../resources/icons/format/light/beautiful.svg'),
    require('../../resources/icons/format/light/beautiful.svg'),
    require('../../resources/icons/focus/light/left.svg'),
    require('../../resources/icons/focus/light/top.svg'),
    require('../../resources/icons/focus/light/bottom.svg'),
    require('../../resources/icons/focus/light/right.svg'),
    require('../../resources/icons/align/light/left.svg'),
    require('../../resources/icons/align/light/center.svg'),
    require('../../resources/icons/align/light/right.svg'),
    require('../../resources/icons/insert/light/left.svg'),
    require('../../resources/icons/insert/light/top.svg'),
    require('../../resources/icons/insert/light/bottom.svg'),
    require('../../resources/icons/insert/light/right.svg'),
    require('../../resources/icons/remove/light/column.svg'),
    require('../../resources/icons/remove/light/row.svg'),
    require('../../resources/icons/move/light/left.svg'),
    require('../../resources/icons/move/light/top.svg'),
    require('../../resources/icons/move/light/bottom.svg'),
    require('../../resources/icons/move/light/right.svg'),
    require('../../resources/icons/multi-select/light/select.svg'),
    require('../../resources/icons/multi-select/light/all.svg'),
    require('../../resources/icons/multi-select/light/empty.svg'),
    require('../../resources/icons/sort/light/number-asc.svg'),
    require('../../resources/icons/sort/light/number-desc.svg'),
    require('../../resources/icons/sort/light/text-asc.svg'),
    require('../../resources/icons/sort/light/text-desc.svg'),
    require('../../resources/icons/sort/light/text-asc-ignore.svg'),
    require('../../resources/icons/sort/light/text-desc-ignore.svg'),
];

const darkIcons = [
  require('../../resources/icons/format/dark/fill-cells.svg'),
  require('../../resources/icons/format/dark/beautiful.svg'),
  require('../../resources/icons/format/dark/beautiful.svg'),
  require('../../resources/icons/format/dark/beautiful.svg'),
  require('../../resources/icons/focus/dark/left.svg'),
  require('../../resources/icons/focus/dark/top.svg'),
  require('../../resources/icons/focus/dark/bottom.svg'),
  require('../../resources/icons/focus/dark/right.svg'),
  require('../../resources/icons/align/dark/left.svg'),
  require('../../resources/icons/align/dark/center.svg'),
  require('../../resources/icons/align/dark/right.svg'),
  require('../../resources/icons/insert/dark/left.svg'),
  require('../../resources/icons/insert/dark/top.svg'),
  require('../../resources/icons/insert/dark/bottom.svg'),
  require('../../resources/icons/insert/dark/right.svg'),
  require('../../resources/icons/remove/dark/column.svg'),
  require('../../resources/icons/remove/dark/row.svg'),
  require('../../resources/icons/move/dark/left.svg'),
  require('../../resources/icons/move/dark/top.svg'),
  require('../../resources/icons/move/dark/bottom.svg'),
  require('../../resources/icons/move/dark/right.svg'),
  require('../../resources/icons/multi-select/dark/select.svg'),
  require('../../resources/icons/multi-select/dark/all.svg'),
  require('../../resources/icons/multi-select/dark/empty.svg'),
  require('../../resources/icons/sort/dark/number-asc.svg'),
  require('../../resources/icons/sort/dark/number-desc.svg'),
  require('../../resources/icons/sort/dark/text-asc.svg'),
  require('../../resources/icons/sort/dark/text-desc.svg'),
  require('../../resources/icons/sort/dark/text-asc-ignore.svg'),
  require('../../resources/icons/sort/dark/text-desc-ignore.svg'),
];



const maps = {
  'format': ['fill-cells', 'beautiful', 'natural', 'delete-comment'],
  'focus': ['left', 'top', 'bottom', 'right'],
  'align': ['left', 'center', 'right'],
  'insert': ['left', 'top', 'bottom', 'right'],
  'remove': ['column', 'row'],
  'move': ['left', 'top', 'bottom', 'right'],
  'multi-select': ['select', 'all', 'empty'],
  'sort': ['number-asc', 'number-desc', 'text-asc', 'text-desc', 'text-asc-ignore', 'text-desc-ignore']
}
export const CommandCategories = [...Object.keys(maps)];

const flatMaps = [...Object.entries(maps)]
  .map(([cate, cmds]) => cmds.map(cmd => [cate, cmd]))
  .flat()

 export const lightIconsMap = new Map(flatMaps.map((flat, idx) => [`${flat[0]}:${flat[1]}`, lightIcons[idx]]))
 export const darkIconsMap = new Map(flatMaps.map((flat, idx) => [`${flat[0]}:${flat[1]}`, darkIcons[idx]]))

 console.log(darkIconsMap)

export default maps;
