import { tabs } from "../globals"
import { effect } from "../utils/utils"

export const setupNav = function(sheet: PcSheet) {
    for(let i=0; i<tabs.length; i++) {
        log("[INFO] Setup navigation for " + tabs[i] + " : " + sheet.raw().properName())
        sheet.find(tabs[i] + "_nav").on("click", function(cmp) {
            for(let j=0; j<tabs.length; j++) {
                sheet.find(tabs[j] + "_tab").hide()
                sheet.find(tabs[j] + "_nav").removeClass("active")
                sheet.find(tabs[j] + "_nav").removeClass("text-light")
                sheet.find(tabs[j] + "_nav").addClass("text-muted")
            }
            sheet.find(cmp.id().slice(0, -4)  + "_tab").show()
            sheet.find(cmp.id()).addClass("active")
            sheet.find(cmp.id()).addClass("text-light")
            sheet.find(cmp.id()).removeClass("text-muted")
        })
    }
}

export const setDice = function(sheet: PcSheet) {
    effect(function() {
        if(sheet.nbDice() > 2) {
            sheet.find("nb_dice").addClass("text-success")
            sheet.find("nb_dice").removeClass("text-danger")
        } else if(sheet.nbDice() < 2) {
            sheet.find("nb_dice").removeClass("text-success")
            sheet.find("nb_dice").addClass("text-danger")
        } else {
            sheet.find("nb_dice").removeClass("text-success")
            sheet.find("nb_dice").removeClass("text-danger")
        }
        sheet.find("nb_dice").value(sheet.nbDice() + " :dice-d20:")
    }, [sheet.nbDice])
}