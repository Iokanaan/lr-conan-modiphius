import { globalSheets } from "../globals"
import { basicUpdateHandler, computed, effect, signal } from "../utils/utils"

export const onTalentEdit = function(entry: Component<TalentData>) {
    const compCatSignal = signal(entry.find("talent_competence").value())
    entry.find("talent_competence").on("update", basicUpdateHandler(compCatSignal))
    effect(function() {
        const choices: Record<string, string> = {};
        log("Usinng cat "  + compCatSignal())
        if(compCatSignal() === "origine_caste") {
            (Tables.get("talents_origine") as Table<TalentEntity>).each(function(e) {
                choices[e.id] = e.name
            });
            (Tables.get("talents_caste") as Table<TalentEntity>).each(function(e) {
                choices[e.id] = e.name
            })
        } else {
            (Tables.get("talents_" + compCatSignal()) as Table<TalentEntity>).each(function(e) {
                choices[e.id] = e.name
            })
        }
        (entry.find("talent_nom") as ChoiceComponent<string>).setChoices(choices)
        entry.find("talent_nom").value(Object.keys(choices)[0])
    }, [compCatSignal])
    const compSignal = signal(entry.find("talent_nom").value())
    const selectedComp = computed(function() {
        if(compCatSignal() === "origine_caste") {
            if(Tables.get("talents_caste").get(compSignal()) !== null) {
                return Tables.get("talents_caste").get(compSignal())
            } else {
                return Tables.get("talents_origine").get(compSignal())
            }
        } else {
            return Tables.get("talents_" + compCatSignal()).get(compSignal())
        }
    }, [compSignal])

    entry.find("talent_nom").on("update", basicUpdateHandler(compSignal))
    effect(function() {
        entry.find("talent_niveau_max").value(selectedComp().max)
        entry.find("talent_niveau_label").value(selectedComp().max)
    }, [selectedComp])

    entry.find("talent_add_bird").on("click", function() {
        entry.find("talent_effet").value(entry.find("talent_effet").value() + " :ga_eagle-emblem:")
    })
}


export const onTalentDisplay = function(entry: Component<TalentData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
    const talents = sheet.talents()
    const currTalent = entry.value()
    talents[entry.id()] = currTalent
    sheet.talents.set(talents)
    
    if(currTalent.talent_competence === "origine_caste") {
        if(Tables.get("talents_origine").get(currTalent.talent_nom) !== null) {
            entry.find("talent_label").value(Tables.get("talents_origine").get(currTalent.talent_nom).name)
            entry.find("talent_comp_label").value(_("(Origine)"))
        } else {
            entry.find("talent_label").value(Tables.get("talents_caste").get(currTalent.talent_nom).name)
            entry.find("talent_comp_label").value(_("(Caste)"))
        }
    } else {
        entry.find("talent_label").value(Tables.get("talents_" + currTalent.talent_competence).get(currTalent.talent_nom).name)
        entry.find("talent_comp_label").value("(" + _(Tables.get("talents_competences").get(currTalent.talent_competence).name) + ")")
    }
    

    if(currTalent.talent_niveau_max > 1) {
        entry.find("talent_niveau").show()
        entry.find("talent_niveau").on("update", function(c) {
            if(c.value() > currTalent.talent_niveau_max) {
                c.value(currTalent.talent_niveau_max)
            }
        })
    } else {
        entry.find("talent_niveau").hide()
    }

    sheet.find("talent_filter").value("0")
}

export const onTalentDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const talents = sheet.talents()
        delete talents[entryId]
        sheet.talents.set(talents)
    }
}

export const filterTalents = function(sheet: PcSheet) {
    const filteringValue = signal(sheet.find("talent_filter").value());

    sheet.find("talent_filter").on("update", basicUpdateHandler(filteringValue))
    effect(function() {
        const talentData = sheet.talents()
        const keys = Object.keys(talentData)
        for(let k=0;k<keys.length;k++) {
            if(filteringValue() !== undefined && filteringValue() !== null && filteringValue() != 0 && talentData[keys[k]].talent_competence !== filteringValue()){
                sheet.find("talents_repeater").find(keys[k]).hide()
            } else {
                sheet.find("talents_repeater").find(keys[k]).show()
            }
        }
    }, [filteringValue, sheet.talents])

    effect(function() {
        const talents = sheet.talents()
        const keys = Object.keys(talents)
        const usedComps: Partial<Record<Competence | "origine_caste" | "fortune" | "0", string>> = {"0": ""}
        for(let k=0;k<keys.length;k++) {
            usedComps[talents[keys[k]].talent_competence] = Tables.get("talents_competences").get(talents[keys[k]].talent_competence).name          
        }
        if(usedComps[sheet.find("talent_filter").value() as Competence | "origine_caste" | "fortune" | "0"] === undefined) {
            log("doing")
            sheet.find("talent_filter").value("0")
        }
        (sheet.find("talent_filter") as ChoiceComponent<string>).setChoices(usedComps)
    }, [sheet.talents])

}
