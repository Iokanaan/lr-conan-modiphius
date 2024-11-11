import { wordToInt } from "../utils/utils"

export const resultCallback = function(result: DiceResult) {
    return function(sheet: Sheet) {
        let flex = 0
        let flexDie = undefined
        let total = 0

        if(result.containsTag("auto")) {
            for(let i=0; i<result.children.length; i++) {
                if(result.children[i].tags !== null && result.children[i].tags.indexOf("flex") !== -1) {
                    flex = result.children[i].total
                    flexDie = result.children[i].dimension
                } else {
                    total += result.children[i].total
                    if(!result.containsTag("initiative"))
                    if(result.children[i].children[0].children[0].total === 1 && !result.containsTag("damage")) {
                        sheet.get("result").addClass("text-danger")
                    }
                }
            }
        } else {
            total = result.total
        }
        sheet.get("result").value(total)
        if(flexDie !== undefined) {
            sheet.get("flex_col").show()
            sheet.get("flex_result").value(flex)
            if(flexDie === flex) {
                sheet.get("flex_label").addClass("text-success")
                sheet.get("flex_result").addClass("text-success")
            }
        } else {
            sheet.get("flex_col").hide()
        } 
    }
}

// Fonction pour traduire la valeur d'un tag en integer
const parseIntTag = function(tags: string[], regex: RegExp): number | undefined {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return undefined
    }
}