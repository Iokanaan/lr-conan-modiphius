import { globalSheets } from "./globals"
import { pcSheet } from "./sheets/pcSheet"
import { setDice, setupNav } from "./nav/nav"
import { rollStats } from "./stats/stats"
import { parseIntTag, resultCallback } from "./roll/handleRoll"
import { setupRepeater } from "./utils/repeaters"
import { onArmeDelete, onArmesDisplay, onWeaponEdit, setCombatBonus, setupMainsNues } from "./combat/armes"
import { onArmureDelete, onArmureDisplay, setupArmorSchema, setupEncConditionnel } from "./combat/armures"
import { rollMenaces } from "./combat/menaces"
import { filterTalents, onTalentDelete, onTalentDisplay, onTalentEdit } from "./talents/talents"
import { onSpellDelete, onSpellDisplay, onSpellEdit } from "./sorceries/spells"
import { onAlchimieDelete, onAlchimieDisplay, onAlchimieEdit } from "./sorceries/alchimie"


initRoll = function(result: DiceResult, callback: DiceResultCallback) {
    callback('dice_result', resultCallback(result))
}

init = function(sheet: Sheet) {
    if(sheet.id() === "main") {
        const s = pcSheet(sheet)
        globalSheets[sheet.getSheetId()] = s
        try {
            setupNav(s)
        } catch(e) {
            log("[CRITICAL]: Failed setting up navigation for " + sheet.getSheetId())
        }
        log("Set roll stats")
        rollStats(s)
        log("Set roll Dices")
        setDice(s)
        setupRepeater(s, "armes_repeater", onWeaponEdit, onArmesDisplay, onArmeDelete(s))
        log("Set combat bonus")
        setCombatBonus(s)
        
        setupMainsNues(s)
        setupRepeater(s, "armures_repeater", null, onArmureDisplay, onArmureDelete(s))
        setupArmorSchema(s)
        setupEncConditionnel(s)
        rollMenaces(s)
        setupRepeater(s, "talents_repeater", onTalentEdit, onTalentDisplay, onTalentDelete(s))
        filterTalents(s)
        setupRepeater(s, "spells_repeater", onSpellEdit, onSpellDisplay, onSpellDelete(s))
        setupRepeater(s, "alchimie_repeater", onAlchimieEdit, onAlchimieDisplay, onAlchimieDelete(s))
    }
}

getCriticalHits = function(result) {
    if(result.containsTag('comp')) { 
        const con = parseIntTag(result.allTags, /con_/)
        if(con !== undefined) {
            const crits: number[] = []
            for(let i=1; i<=con; i++) {
                crits.push(i)
            }
            return {
                "20": {
                   "critical": crits,
                   "fumble": [20]
                }
            }
        }
    }
    return {
        "20": {
            "critical": [1],
            "fumble": [20]
        }
    }
}