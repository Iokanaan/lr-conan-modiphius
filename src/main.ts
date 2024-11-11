import { onArmorDelete, onArmorDisplay, onArmorEdit } from "./equipment/armor"
import { onItemDelete, onItemDisplay, onItemEdit } from "./equipment/items"
import { onWeaponDelete, onWeaponDisplay, onWeaponEdit } from "./equipment/weapons"
import { globalSheets } from "./globals"
import { pcSheet } from "./sheets/pcSheet"
import { resultCallback } from "./roll/handleRoll"
import { displaySorcerySkill, onSpellDelete, onSpellDisplay } from "./skills/sorcerySkills"
import { rollStats } from "./stats/stats"
import { reset, setupRepeater } from "./utils/repeaters"
import { minionSheet } from "./sheets/minionSheet"
import { setupOriginEdit } from "./origin/origin"
import { antagonistSheet } from "./sheets/antagonistSheet"
import { setupOriginBonusBind, setupOriginBonusEdit } from "./skills/originBonuses"
import { onSkillDelete, onSkillDisplay } from "./skills/skill"
import { setupNav } from "./nav/nav"
import { sheetData } from "./data/data"

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
        try {
            sheetData(s)
        } catch(e) {
            log("[ERROR]: Failed setting processed data for " + sheet.getSheetId())
        }
        try {
            s.find("char_name").value(sheet.properName())
            rollStats(s)
            
        } catch(e) {
            log("[ERROR]: Failed setting stats / AR for " + sheet.getSheetId())
        }
        try {
            setupOriginEdit(s)
            setupOriginBonusEdit(s)
            setupOriginBonusBind(s)
        } catch(e) {
            log("[ERROR]: Failed setting up Origin for " + sheet.getSheetId())
        }

        try {
            displaySorcerySkill(s)
        } catch(e) {
            log("[ERROR]: Failed setting up Parameters for " + sheet.getSheetId())
        }
        try {
            setupRepeater(s, "armors", onArmorEdit, onArmorDisplay, onArmorDelete(s))
        } catch(e) {
            log("[ERROR]: Failed setting up armors repeater for " + sheet.getSheetId())
        }
        try {
            setupRepeater(s, "weapons", onWeaponEdit, onWeaponDisplay, onWeaponDelete(s))
        } catch(e) {
            log("[ERROR]: Failed setting up armors repeater for " + sheet.getSheetId())
        }
        try {
            setupRepeater(s, "items", onItemEdit, onItemDisplay, onItemDelete(s))
        } catch(e) {
            log("[ERROR]: Failed setting up items repeater for " + sheet.getSheetId())
        }
        try {
            setupRepeater(s, "skills_r", null, onSkillDisplay, onSkillDelete(s));
        } catch(e) {
            log("[ERROR]: Failed setting up skill repeater for " + sheet.getSheetId())
        }
        try {
            setupRepeater(s, "sorcery_r", null, onSpellDisplay, onSpellDelete(s));
        } catch(e) {
            log("[ERROR]: Failed setting up sorcery repeater for " + sheet.getSheetId())
        }
    }

    if(sheet.id() === "minion") {
        const minion = minionSheet(sheet)
        globalSheets[sheet.getSheetId()] = minion
        rollStats(minion)
        setupRepeater(minion, "weapons", onWeaponEdit, onWeaponDisplay, onWeaponDelete(minion))
    }

    if(sheet.id() === "antagonist") {
        const antagonist = antagonistSheet(sheet)
        globalSheets[sheet.getSheetId()] = antagonist
        rollStats(antagonist)
        setupRepeater(antagonist, "weapons", onWeaponEdit, onWeaponDisplay, onWeaponDelete(antagonist))
    }
}

drop = function(from, to) {
    const s = globalSheets[to.getSheetId()]
    if (from.id() === "skill_edit" && to.id() === "main") {
        reset(s as PcSheet, "skills_r", null, onSkillDisplay)
        return "skills_r"; 
    }
    if (from.id() === "spell_edit" && to.id() === "main") {
        reset(s as PcSheet, "sorcery_r", null, onSpellDisplay)
        return "sorcery_r"; 
    }
}


getCriticalHits = function(result) {
    return {
        "20": {
            "critical": [20],
            "fumble": [1],
        },
        "12": {
            "critical": [12],
            "fumble": [1],
        },
        "10": {
            "critical": [10],
            "fumble": [1],
        },
        "8": {
            "critical": [8],
            "fumble": [1],
        },
        "6": {
            "critical": [6],
            "fumble": [1],
        },
        "4": {
            "critical": [4],
            "fumble": [1],
        },
    }
}