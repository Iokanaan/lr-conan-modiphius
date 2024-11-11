import { globalSheets } from "../globals"
import { effect } from "../utils/utils"

export const onArmorEdit = function(entry: Component<ArmorData>) {
    if(entry.value().armor_ar === undefined) {
        entry.find("armor_ar").value(1)
    }
}

export const onArmorDisplay = function(entry: Component<ArmorData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()] as PcSheet
    let armors = sheet.armors()
    const curr_armor = entry.value()
    armors[entry.id()] = curr_armor
    sheet.armors.set(armors)

    // Binding
    let bindingName = curr_armor.armor_name
    if(bindingName === undefined || bindingName === "") {
        bindingName = _("Armor") + " " + entry.index()
    }
    
    Bindings.add(bindingName, "armor_info", "armor_binding", function() {
        return entry.value()
    })
        
    entry.find("armor_info").on("click", function() {
        Bindings.send(entry.sheet(), bindingName)
    })
    
}

export const onArmorDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const armors = sheet.armors()
        delete armors[entryId]
        sheet.armors.set(armors)
    }
}