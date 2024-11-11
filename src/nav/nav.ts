import { tabs } from "../globals"

export const setupNav = function(sheet: PcSheet) {
    for(let i=0; i<tabs.length; i++) {
        log("[INFO] Setup navigation for " + tabs[i] + " : " + sheet.raw().properName())
        sheet.find("nav_" + tabs[i]).on("click", function(cmp) {
            for(let j=0; j<tabs.length; j++) {
                sheet.find(tabs[j]).hide()
                sheet.find("nav_" + tabs[j]).removeClass("active")
                sheet.find("nav_" + tabs[j]).removeClass("text-light")
                sheet.find("nav_" + tabs[j]).addClass("text-muted")
            }
            sheet.find(cmp.id().substring(4)).show()
            sheet.find(cmp.id()).addClass("active")
            sheet.find(cmp.id()).addClass("text-light")
            sheet.find(cmp.id()).removeClass("text-muted")
        })
    }
}