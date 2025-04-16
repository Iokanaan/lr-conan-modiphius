import { intToWord, wordToInt } from "../utils/utils"

export const resultCallback = function(result: DiceResult) {
    return function(sheet: Sheet) {
        if(result.containsTag('comp')) {
            sheet.get("result").value(result.success + " succès")
            sheet.get("localisation").hide()
            sheet.get("d20_result_row").show()
            sheet.get("d6_result_row").hide()
        }
        if(result.containsTag('attack')) {
            sheet.get("result").value(result.children[0].children[0].total + " succès")
            const dLoc = result.children[0].children[1].total
            if(dLoc >= 18) {
                sheet.get("localisation").value(_("Jambe gauche") + " (" + dLoc + ")")
            } else if(dLoc >= 15) {
                sheet.get("localisation").value(_("Jambe droite") + " (" + dLoc + ")")
            } else if(dLoc >= 9) {
                sheet.get("localisation").value(_("Torse") + " (" + dLoc + ")")
            } else if(dLoc >= 6) {
                sheet.get("localisation").value(_("Bras gauche") + " (" + dLoc + ")")
            } else if(dLoc >= 3) {
                sheet.get("localisation").value(_("Bras droit") + " (" + dLoc + ")")
            } else {
                sheet.get("localisation").value(_("Tête") + " (" + dLoc + ")")
            }
            sheet.get("d20_result_row").show()

            const dDamage = result.children[1]
            sheet.get("d6_result").value(dDamage.total)
            let birds = 0 
            for(let d=0; d<dDamage.all.length; d++) {
                if(dDamage.all[d].value >= 5) {
                    birds++
                } 
            }
            sheet.get("birds_result").value(birds + " :ga_eagle-emblem:")
            sheet.get("d6_result_row").show()
        } else if(result.containsTag('menace')) {
            sheet.get("result").value(result.children[0].total + " succès")
            sheet.get("d20_result_row").show()
            const dDamage = result.children[1]
            sheet.get("d6_result").value(dDamage.total)
            let birds = 0 
            for(let d=0; d<dDamage.all.length; d++) {
                if(dDamage.all[d].value >= 5) {
                    birds++
                } 
            }
            sheet.get("localisation").hide()
            sheet.get("birds_result").value(birds + " :ga_eagle-emblem:")
            sheet.get("d6_result_row").show()
        } else if(result.containsTag('bird')) {
            sheet.get("d6_result").value(result.children[0].total)
            let birds = 0 
            for(let d=0; d<result.children[0].all.length; d++) {
                if(result.children[0].all[d].value >= 5) {
                    birds++
                } 
            }
            sheet.get("birds_result").value(birds + " :ga_eagle-emblem:")
            sheet.get("localisation").hide()
            sheet.get("d6_result_row").removeClass("border-top")
            sheet.get("d6_result_row").removeClass("mt-2")
            sheet.get("d6_result_row").removeClass("pt-2")
            sheet.get("d6_result_row").show()
            sheet.get("d20_result_row").hide()
        }
    }
}

// Fonction pour traduire la valeur d'un tag en integer
export const parseIntTag = function(tags: string[], regex: RegExp): number | undefined {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return undefined
    }
}

export const buildCrits = function(sheet: PcSheet, comp: Competence) {
    let critExpression = ""
    const critsUnder = sheet.competences[comp].con()
    if(critsUnder > 0) {
        const crits = []
        for(let i=1; i<=critsUnder; i++) {
            crits.push(i + ":2")
        }
        critExpression = "{" + crits.join(",") + "}"
    }
    return {
        "tag": "con_" + intToWord(critsUnder),
        "expression": critExpression
    }
}

export const rollD6 = function(s: PcSheet, nbDice: number, title: string) {
    log("Rolling " + nbDice + "d6 <={1:1,2:2,3:0,4:0,5:1,6:1} 6")
    new RollBuilder(s.raw()).expression("(" + nbDice + "d6 <={1:1,2:2,3:0,4:0,5:1,6:1} 6)[bird,auto]" ).title(title).roll()
    s.birdDice.set(0)
}