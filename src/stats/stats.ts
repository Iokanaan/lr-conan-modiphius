import { competences } from "../globals"
import { effect, intToWord } from "../utils/utils"

export const handleStatRoll = function(sheet: PcSheet, comp: Competence, title: string) {
    return function(cmp: Component) {
        log("Rolling for :" + comp)
        const critsUnder = sheet.competences[comp].con()
        let critExpression = ""
        if(critsUnder > 0) {
            const crits = []
            for(let i=1; i<=critsUnder; i++) {
                crits.push(i + ":2")
            }
            critExpression = "{" + crits.join(",") + "}"
        }
        log(sheet.nbDice() + "d20[comp,con_" + intToWord(critsUnder) + "] <=" + critExpression + " " + sheet.competences[comp].vr())
        log(title)
        new RollBuilder(sheet.raw())
            .expression(sheet.nbDice() + "d20[comp,con_" + intToWord(critsUnder) + "] <=" + critExpression + " " + sheet.competences[comp].vr())
            .title(title)
            .roll()
        sheet.nbDice.set(2)
    }
}

const handleVrEffect = function(sheet: PcSheet, comp: Competence) {
    return function() {
        const vr = sheet.competences[comp].vr()
        if(vr !== sheet.find(comp + "_vr").value()) {
            sheet.find(comp + "_vr").value(vr)
        }
    }
}

export const rollStats = function(sheet: PcSheet) {
    const stats = Object.keys(competences) as Stat[]
    for(let i=0; i<stats.length; i++) {
        const currStat = stats[i]
        for(let j=0; j<competences[currStat].length; j++) {
            const currComp = competences[currStat][j]
            effect(handleVrEffect(sheet, currComp), [sheet.competences[currComp].vr])
            sheet.find(currComp + "_label").on("click", handleStatRoll(sheet, currComp, Tables.get("talents_competences").get(currComp).name))
        }
    }
}
