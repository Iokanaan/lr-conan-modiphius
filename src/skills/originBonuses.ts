import { effect } from "../utils/utils"

export const setupOriginBonusEdit = function(sheet: PcSheet) {
    effect(function() {
        if(sheet.origin.origin_bonus() !== undefined && sheet.origin.origin_bonus().trim() !== "") {
            sheet.find("origin_bonus_label").show()
            sheet.find("origin_bonus").hide()
            sheet.find("origin_bonus_label").value(sheet.origin.origin_bonus().trim())
        } else {
            sheet.find("origin_bonus_label").hide()
            sheet.find("origin_bonus").show()
        }
    }, [sheet.origin.origin_bonus]);

    sheet.find("origin_bonus_label").on("click", function(cmp) {
        cmp.hide()
        sheet.find("origin_bonus").show()
    })
}

export const setupOriginBonusBind = function(sheet: PcSheet) {
    // Binding
    Bindings.add(_("Origin Bonuses"), "origin_bonus_info", "origin_bonus", function() {
        return { 
            "origin_bonus_label": sheet.find("origin_bonus_label").value() 
        }
    })
    sheet.find("origin_bonus_info").on("click", function() {
        Bindings.send(sheet.raw(), _("Origin Bonuses"))
    })
}