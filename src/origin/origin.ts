import { effect } from "../utils/utils"

export const setupOriginEdit = function(sheet: PcSheet) {
    effect(function() {
        if(sheet.origin.origin_name() !== undefined && sheet.origin.origin_name().trim() !== "") {
            sheet.find("origin_name_label").show()
            sheet.find("origin_name").hide()
            sheet.find("origin_name_label").value(sheet.origin.origin_name().trim())
        } else {
            sheet.find("origin_name_label").hide()
            sheet.find("origin_name").show()
        }
    }, [sheet.origin.origin_name]);

    sheet.find("origin_name_label").on("click", function(cmp) {
        cmp.hide()
        sheet.find("origin_name").show()
    })
}