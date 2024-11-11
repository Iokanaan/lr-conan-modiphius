import { globalSheets } from "../globals"
import { effect } from "../utils/utils"

export const displaySorcerySkill = function(sheet: PcSheet) {
    effect(function() {
        if(sheet.sorcerer()) {
            sheet.find("sorcerer_col").show()
        } else {
            sheet.find("sorcerer_col").hide()
        }
    }, [sheet.sorcerer])
}

export const onSpellDisplay = function(entry: Component<SpellData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()] as PcSheet
    const spells = sheet.spells()
    const curr_spell = entry.value()
    spells[entry.id()] = curr_spell
    sheet.spells.set(spells)

    // Binding
    let bindingName = entry.value().spell_name
    if(bindingName === undefined || bindingName === "") {
        bindingName = _("Spell") + " " + entry.index()
    }
    Bindings.add(bindingName, "spell_info", "spell_binding", function() {
        return entry.value()
    })
    
    entry.find("spell_info").on("click", function() {
        Bindings.send(entry.sheet(), bindingName)
    })              
}


export const onSpellDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const spells = sheet.spells()
        delete spells[entryId]
        sheet.spells.set(spells)
    }
}