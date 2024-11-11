import { globalSheets } from "../globals"

export const onItemEdit = function(entry: Component<ItemData>) {
    if(entry.value().item_qty === undefined) {
        entry.find("item_qty").value(1)
    }
}

export const onItemDisplay = function(entry: Component<ItemData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()] as PcSheet
    const items = sheet.items()
    const curr_item = entry.value()
    items[entry.id()] = curr_item
    sheet.items.set(items)
}

export const onItemDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const items = sheet.items()
        delete items[entryId]
        sheet.items.set(items)
    }
}