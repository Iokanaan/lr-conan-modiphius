import { globalSheets } from "./globals"
import { pcSheet } from "./sheets/pcSheet"
import { setDice, setupNav } from "./nav/nav"
import { rollStats } from "./stats/stats"
import { parseIntTag, resultCallback } from "./roll/handleRoll"
import { setupRepeater } from "./utils/repeaters"
import { onArmeDelete, onArmesDisplay, onWeaponEdit, setCombatBonus, setupMainsNues } from "./combat/armes"
import { onArmureDelete, onArmureDisplay, setupArmorSchema, setupEncConditionnel } from "./combat/armures"
import { rollMenaces, setupMenaceBonus } from "./combat/menaces"
import { filterTalents, onTalentDelete, onTalentDisplay, onTalentEdit } from "./talents/talents"


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
        rollStats(s)
        setDice(s)
        setupRepeater(s, "armes_repeater", onWeaponEdit, onArmesDisplay, onArmeDelete(s))
        setCombatBonus(s)
        setupMainsNues(s)
        setupRepeater(s, "armures_repeater", null, onArmureDisplay, onArmureDelete(s))
        setupArmorSchema(s)
        setupEncConditionnel(s)
        rollMenaces(s)
        setupMenaceBonus(s)
        setupRepeater(s, "talents_repeater", onTalentEdit, onTalentDisplay, onTalentDelete(s))
        filterTalents(s)
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