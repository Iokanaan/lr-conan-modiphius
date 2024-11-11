import { stats } from "../globals"

const handleStatRoll = function(sheet: PcSheet | MinionSheet, stat: Stat) {
    return function(cmp: Component) {
        const die = sheet.stats[stat].die()
        const bonus = sheet.stats[stat].value()
        let expression = "(1d" + die + " + " + bonus +")[auto]"
        if((sheet as PcSheet).flex !== undefined) {
            expression += " + 1d" + (sheet as PcSheet).flex() + "[flex]"
        }
        log("[INFO] Rolling : " + expression)
        new RollBuilder(sheet.raw())
            .expression(expression)
            .title(cmp.text())
            .visibility(sheet.visibility())
            .roll()
    }
}

export const rollStats = function(sheet: PcSheet | MinionSheet) {
    for(let i=0; i<stats.length; i++) {
        sheet.find("roll_" + stats[i]).on("click", handleStatRoll(sheet, stats[i]))
    }
    sheet.find("roll_init").on("click", function() {
            const expression = "(1d" + sheet.stats['edge'].die()  + " + " + sheet.stats['edge'].value() + ")[initiative]"
            log("[INFO] Rolling : " + expression)
            new RollBuilder(sheet.raw())
                .expression(expression)
                .title(_("Initiative"))
                .roll()
    })
}
