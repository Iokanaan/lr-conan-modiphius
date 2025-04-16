import { globalSheets } from "../globals"
import { rollD6 } from "../roll/handleRoll"
import { handleStatRoll } from "../stats/stats"
import { basicUpdateHandler, effect, signal } from "../utils/utils"

export const onAlchimieEdit = function(entry: Component<RawAlchimieData>) {    
    const alchimieType = signal(entry.find("alchimie_type").value() as AlchimieType)
    entry.find("alchimie_type").on("update", basicUpdateHandler(alchimieType))

    effect(function() {
        switch (alchimieType()) {
            case "poudre_explosive":
            case "poudre_aveuglante":
            case "liquide_incendiaire":
                entry.find("alchimie_qualites_row").show()
                entry.find("alchimie_handicap_row").hide()
                entry.find("alchimie_effets_row").hide()
                entry.find("alchimie_degats_col").show()
                entry.find("alchimie_couvert_col").hide()
                entry.find("alchimie_courage_col").hide()
                entry.find("alchimie_forme_row").hide()
                break
            case "tissu":
                entry.find("alchimie_qualites_row").hide()
                entry.find("alchimie_handicap_row").hide()
                entry.find("alchimie_effets_row").hide()
                entry.find("alchimie_degats_col").hide()
                entry.find("alchimie_couvert_col").hide()
                entry.find("alchimie_courage_col").hide()
                entry.find("alchimie_forme_row").hide()
                break
            case "verre":
                entry.find("alchimie_qualites_row").hide()
                entry.find("alchimie_handicap_row").hide()
                entry.find("alchimie_effets_row").hide()
                entry.find("alchimie_degats_col").hide()
                entry.find("alchimie_couvert_col").show()
                entry.find("alchimie_courage_col").hide()
                entry.find("alchimie_forme_row").hide()
                break
            case "talisman":
                entry.find("alchimie_qualites_row").hide()
                entry.find("alchimie_handicap_row").show()
                entry.find("alchimie_effets_row").show()
                entry.find("alchimie_degats_col").hide()
                entry.find("alchimie_couvert_col").hide()
                entry.find("alchimie_courage_col").show()
                entry.find("alchimie_forme_row").hide()
                break
            case "pollen":
                entry.find("alchimie_qualites_row").hide()
                entry.find("alchimie_handicap_row").hide()
                entry.find("alchimie_effets_row").show()
                entry.find("alchimie_degats_col").show()
                entry.find("alchimie_couvert_col").hide()
                entry.find("alchimie_courage_col").hide()
                entry.find("alchimie_forme_row").show()
                break
            default:
                break
        }
    }, [alchimieType]);

    const alchimieQualites = signal(entry.find("alchimie_qualites").value() as AlchimieQualite[])
    entry.find("alchimie_qualites").on("update", basicUpdateHandler(alchimieQualites))
    effect(function() {
        (Tables.get("alchimie_qualites") as Table<AlchimieQualiteEntity>).each(function(q) {
            log("Do effect")
            if(q.type === "Variable") {
                if(alchimieQualites() !== undefined && alchimieQualites().indexOf(q.id) !== -1) {
                    entry.find("alchimie_" + q.id + "_col").show()
                } else {
                    entry.find("alchimie_" + q.id + "_col").hide()
                }
            }
        })
    }, [alchimieQualites])
}

export const mapAlchimieData = function(rawAlchimieData: RawAlchimieData): AlchimieData {
    const alchimieData = {} as AlchimieData
    alchimieData.alchimie_degats = rawAlchimieData.alchimie_degats;
    alchimieData.alchimie_couvert = rawAlchimieData.alchimie_couvert
    alchimieData.alchimie_difficulte = rawAlchimieData.alchimie_difficulte
    alchimieData.alchimie_courage = rawAlchimieData.alchimie_courage
    alchimieData.alchimie_type = rawAlchimieData.alchimie_type
    alchimieData.alchimie_forme = rawAlchimieData.alchimie_forme
    alchimieData.alchimie_effets = rawAlchimieData.alchimie_effets
    alchimieData.alchimie_handicap = rawAlchimieData.alchimie_handicap
    alchimieData.alchimie_qualites = {};
    if(rawAlchimieData.alchimie_qualites !== undefined) {
        for(let q=0; q<rawAlchimieData.alchimie_qualites.length; q++) {
            const currQualite = rawAlchimieData.alchimie_qualites[q]
            if(Tables.get("alchimie_qualites").get(currQualite).type === "Variable") {
                alchimieData.alchimie_qualites[currQualite] = {
                    niveau: rawAlchimieData["alchimie_" + currQualite + "_lvl"] as number
                }  
            } else {
                alchimieData.alchimie_qualites[currQualite] = {
                    niveau: undefined
                }  
            }
        }
    }
    return alchimieData
}

export const onAlchimieDisplay = function(entry: Component<RawAlchimieData>) {
    const s = globalSheets[entry.sheet().getSheetId()]
    const alchimie = s.alchimie()
    const currAlchmimie = mapAlchimieData(entry.value())
    alchimie[entry.id()] = currAlchmimie
    s.alchimie.set(alchimie)

    entry.find("alchimie_type_val").value(Tables.get("alchimie_categories").get(currAlchmimie.alchimie_type).name)

    const qualitesKeys = Object.keys(currAlchmimie.alchimie_qualites) as AlchimieQualite[];
    const qualiteLabels: string[] = []
    for(let q=0; q<qualitesKeys.length; q++) {
        const qEntity = Tables.get("alchimie_qualites").get(qualitesKeys[q])
        const qualite = currAlchmimie.alchimie_qualites[qualitesKeys[q]]
        if(qEntity.type === "Variable" && qualite !== undefined) {
            if(qualite.niveau !== undefined) {
                qualiteLabels.push(qEntity.name.slice(0, -2) + " " + qualite.niveau)
            } else {
                qualiteLabels.push(qEntity.name)
            }
        } else {
            qualiteLabels.push(qEntity.name)
        }
    }

    entry.find("roll_alchimie").on("click", handleStatRoll(s, "alchimie", entry.find("alchimie_label").text()))

    switch (currAlchmimie.alchimie_type) {
        case "poudre_explosive":
        case "poudre_aveuglante":
        case "liquide_incendiaire":
            entry.find("alchimie_label").addClass("clickable")
            entry.find("alchimie_label").on("click", function() { rollD6(s, currAlchmimie.alchimie_degats,  entry.find("alchimie_label").text()) })
            //
            log(qualiteLabels)
            if(qualiteLabels.length > 0) {
                entry.find("alchimie_qualites_row").show()
                entry.find("alchimie_qualites_label").value("**Qualités: **" + qualiteLabels.join(", "))
            } else {
                entry.find("alchimie_qualites_row").hide()
            }
            //
            entry.find("alchimie_handicap_row").hide()
            entry.find("alchimie_effets_row").hide()
            //
            entry.find("alchimie_degats_label").show()
            entry.find("alchimie_degats_val").show()
            //
            entry.find("alchimie_couvert_label").hide()
            entry.find("alchimie_couvert_val").hide()
            entry.find("alchimie_courage_label").hide()
            entry.find("alchimie_courage_val").hide()
            entry.find("alchimie_forme_label").hide()
            entry.find("alchimie_forme_val").hide()
            break
        case "tissu":
            entry.find("alchimie_qualites_row").hide()
            entry.find("alchimie_handicap_row").hide()
            entry.find("alchimie_effets_row").hide()
            entry.find("alchimie_degats_label").hide()
            entry.find("alchimie_degats_val").hide()
            entry.find("alchimie_couvert_label").hide()
            entry.find("alchimie_couvert_val").hide()
            entry.find("alchimie_courage_label").hide()
            entry.find("alchimie_courage_val").hide()
            entry.find("alchimie_forme_label").hide()
            entry.find("alchimie_forme_val").hide()
            break
        case "verre":
            entry.find("alchimie_qualites_row").hide()
            entry.find("alchimie_handicap_row").hide()
            entry.find("alchimie_effets_row").hide()
            entry.find("alchimie_degats_label").hide()
            entry.find("alchimie_degats_val").hide()
            //
            entry.find("alchimie_couvert_label").show()
            entry.find("alchimie_couvert_val").show()
            //
            entry.find("alchimie_courage_label").hide()
            entry.find("alchimie_courage_val").hide()
            entry.find("alchimie_forme_label").hide()
            entry.find("alchimie_forme_val").hide()
            break
        case "talisman":
            entry.find("alchimie_qualites_row").hide()
            if(currAlchmimie.alchimie_handicap !== undefined && currAlchmimie.alchimie_handicap !== "") {
                entry.find("alchimie_handicap_row").show()
                entry.find("alchimie_handicap_val").value("**Handicaps: **" + currAlchmimie.alchimie_handicap)
            } else {
                entry.find("alchimie_handicap_row").hide()
            }

            if(currAlchmimie.alchimie_effets !== undefined && currAlchmimie.alchimie_effets !== "") {
                entry.find("alchimie_effets_row").show()
                entry.find("alchimie_effets_val").value("**Effets: **" + currAlchmimie.alchimie_effets)
            } else {
                entry.find("alchimie_effets_row").hide()
            }


            entry.find("alchimie_degats_label").hide()
            entry.find("alchimie_degats_val").hide()
            entry.find("alchimie_couvert_label").hide()
            entry.find("alchimie_couvert_val").hide()
            //
            entry.find("alchimie_courage_label").show()
            entry.find("alchimie_courage_val").show()
            //
            entry.find("alchimie_forme_label").hide()
            entry.find("alchimie_forme_val").hide()
            break
        case "pollen":
            entry.find("alchimie_qualites_row").hide()
            entry.find("alchimie_handicap_row").hide()
            //
            if(currAlchmimie.alchimie_effets !== undefined && currAlchmimie.alchimie_effets !== "") {
                entry.find("alchimie_effets_row").show()
                entry.find("alchimie_effets_val").value("**Effets: **" + currAlchmimie.alchimie_effets)
            } else {
                entry.find("alchimie_effets_row").hide()
            }

            //
            if(currAlchmimie.alchimie_degats > 0) {
                //
                entry.find("alchimie_degats_label").show()
                entry.find("alchimie_degats_val").show()
                entry.find("alchimie_label").addClass("clickable")
                entry.find("alchimie_label").on("click", function() { rollD6(s, currAlchmimie.alchimie_degats,  entry.find("alchimie_label").text()) })
                //
            } else {
                entry.find("alchimie_degats_label").hide()
                entry.find("alchimie_degats_val").hide()
            }
            entry.find("alchimie_couvert_label").hide()
            entry.find("alchimie_couvert_val").hide()
            entry.find("alchimie_courage_label").hide()
            entry.find("alchimie_courage_val").hide()
            //
            entry.find("alchimie_forme_label").show()
            entry.find("alchimie_forme_val").show()
            entry.find("alchimie_forme_val").value(Tables.get("alchimie_formes").get(currAlchmimie.alchimie_forme).name)
            //
            break
        default:
            break
    }
}

export const onAlchimieDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const alchimie = sheet.alchimie()
        delete alchimie[entryId]
        sheet.alchimie.set(alchimie)
    }
}
