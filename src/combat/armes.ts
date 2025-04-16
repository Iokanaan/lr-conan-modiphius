import { globalSheets } from "../globals"
import { buildCrits } from "../roll/handleRoll"
import { basicUpdateHandler, effect, lazySet, signal } from "../utils/utils"

export const onWeaponEdit = function(entry: Component<ArmeData>) {
    const armeType = signal(entry.find("arme_type").value() as ArmeType)
    entry.find("arme_type").on("update", basicUpdateHandler(armeType))

    effect(function() {
        if(armeType() === "distance") {
            entry.find("arme_charges_col").show()
        } else {
            entry.find("arme_charges_col").hide()
        }
    }, [armeType])

    const armeQualites = signal(entry.find("arme_qualites").value() as ArmeQualite[])
    entry.find("arme_qualites").on("update", basicUpdateHandler(armeQualites))
    
    effect(function() {
        (Tables.get("armes_qualites") as Table<ArmeQualiteEntity>).each(function(q) {
            if(q.type === "Variable") {
                if(armeQualites().indexOf(q.id) !== -1) {
                    entry.find("arme_" + q.id + "_lvl_col").show()
                } else {
                    entry.find("arme_" + q.id + "_lvl_col").hide()
                }
            }
        })
    }, [armeQualites])

}

export const rollAttack = function(s: PcSheet, comp: Competence, degats: number, title: string) {
    const critData = buildCrits(s, comp)
    let expression = "(" + s.nbDice() + "d20 <=" + critData.expression + " " + s.competences[comp].vr() + ")[attack," + critData.tag + "]"
    expression += " + (1d20)[loc]" 
    if(comp === "melee") {
        expression += " + (" + (degats + s.bonus.melee() + s.birdDice()) + "d6 <={2:2,3:0,4:0} 6)[damage]"
        s.birdDice.set(0)
    } else {
        expression += " + (" + (degats + s.bonus.distance() + s.birdDice()) + "d6 <={2:2,3:0,4:0} 6)[damage]"
        s.birdDice.set(0)
    }
    new RollBuilder(s.raw())
        .expression(expression)
        .title(title)
        .roll()
}


export const mapArmeData = function(rawArmeData: RawArmeData): ArmeData {
    const armeData = {} as ArmeData
    armeData.arme_degats = rawArmeData.arme_degats;
    armeData.arme_encombrement = rawArmeData.arme_encombrement
    armeData.arme_nom = rawArmeData.arme_nom
    armeData.arme_portee = rawArmeData.arme_portee
    armeData.arme_taille = rawArmeData.arme_taille
    armeData.arme_type = rawArmeData.arme_type
    armeData.arme_charges = rawArmeData.arme_charges
    armeData.arme_maniement_deux_mains = rawArmeData.arme_maniement_deux_mains
    armeData.arme_qualites = {};
    if(rawArmeData.arme_qualites !== undefined) {
        for(let q=0; q<rawArmeData.arme_qualites.length; q++) {
            const currQualite = rawArmeData.arme_qualites[q]
            if(Tables.get("armes_qualites").get(currQualite).type === "Variable") {
                armeData.arme_qualites[currQualite] = {
                    niveau: rawArmeData["arme_" + currQualite + "_lvl"] as number
                }  
            } else {
                armeData.arme_qualites[currQualite] = {
                    niveau: undefined
                }  
            }
        }
    }
    return armeData
}

export const setCombatBonus = function(s: PcSheet) {
    effect(function() {
        s.find("melee_bonus").value("Mêlée **+" + s.bonus.melee() + "**")
    }, [s.bonus.melee])
    effect(function() {
        s.find("distance_bonus").value("Distance **+" + s.bonus.distance() + "**")
    }, [s.bonus.distance])
}

export const setupMainsNues = function(s: PcSheet) {
    s.find("roll_main_nues_melee").on("click", function() {
        rollAttack(s, "melee", 2, "Mains nues")
    })
    s.find("roll_main_nues_distance").on("click", function() {
        rollAttack(s,  "armes_distance", 2, "Mains nues (Jet)")
    })
}

export const onArmesDisplay = function(entry: Component<RawArmeData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
    const armes = sheet.armes()
    const currArme = mapArmeData(entry.value())
    armes[entry.id()] = currArme
    sheet.armes.set(armes)

    // Gestion Attaque
    entry.find("arme_label").on("click", function() {
        const degats = currArme.arme_degats !== undefined ? currArme.arme_degats : 0
        if(currArme.arme_type === "distance") {
            rollAttack(sheet, "armes_distance", degats, entry.find("arme_label").value())
            
        } else {
            rollAttack(sheet, "melee", degats, entry.find("arme_label").value())
        }
    })

    // Gestion Jet
    if(currArme.arme_type === "melee") {
        entry.find("arme_jetable").show()
    } else {
        entry.find("arme_jetable").hide()
    }

    entry.find("arme_jetable").on("click", function() {
        const degats = currArme.arme_degats !== undefined ? currArme.arme_degats : 0
        rollAttack(sheet, "armes_distance", degats, entry.find("arme_label").value() + " " + _("(Jet)"))
    })

    // Gestion charges
    if(currArme.arme_type === "distance") {
        entry.find("arme_charges_label").show()
        entry.find("arme_charges").show()
    } else {
        entry.find("arme_charges_label").hide()
        entry.find("arme_charges").hide()
    }

    // Gestion portée
    entry.find("arme_portee_label").value(Tables.get("armes_portees").get(currArme.arme_portee).name)

    // Gestion qualites
    if(currArme.arme_qualites !== undefined && Object.keys(currArme.arme_qualites).length !== 0) {
        const qualitesKeys = Object.keys(currArme.arme_qualites) as ArmeQualite[]
        const qualiteLabels: string[] = []
        for(let q=0; q<qualitesKeys.length; q++) {
            const qEntity = Tables.get("armes_qualites").get(qualitesKeys[q])
            currArme.arme_qualites[qualitesKeys[q]]?.niveau
            const qualite = currArme.arme_qualites[qualitesKeys[q]]
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
        entry.find("arme_qualites_label").value("**Qualités: **" + qualiteLabels.join(", "))
    } else {
        entry.find("arme_qualites_label").value("")
    }



    // Gestion maniement
    const armeManiement = signal(entry.find("arme_maniement_deux_mains").value() as boolean)
    entry.find("arme_maniement_deux_mains").on("update", basicUpdateHandler(armeManiement))
    entry.find("switch_maniement").on("click", function() {
        if(entry.find("arme_maniement_deux_mains").value() === true) {
            entry.find("arme_maniement_deux_mains").value(false)
        } else {
            entry.find("arme_maniement_deux_mains").value(true)
        }
    })
    
    effect(function() {
        switch(entry.value().arme_taille) {
            case "deux_mains":
                if(armeManiement()) {
                    lazySet(entry.find("arme_maniement"),_("2 Mains"))
                } else {
                    entry.find("arme_maniement").value(_("1 Main :exclamation-triangle:"))
                }
                lazySet(entry.find("switch_maniement"),_(":exchange-alt:"))
                break
            case "desequilibree":
                if(armeManiement()) {
                    lazySet(entry.find("arme_maniement"),_("2 Mains"))
                } else {
                    if(sheet.stats['constitution']() >= 9) {
                        lazySet(entry.find("arme_maniement"),_("1 Mains"))
                    } else {
                        lazySet(entry.find("arme_maniement"),_("1 Main :exclamation-triangle:"))
                    }
                }
                lazySet(entry.find("switch_maniement"),_(":exchange-alt:"))
                break
            case "encombrante":
                lazySet(entry.find("arme_maniement"),_("2 Mains"))
                lazySet(entry.find("switch_maniement"),"")
                break
            default:
                lazySet(entry.find("arme_maniement"),_("1 Main"))
                entry.find("switch_maniement").value("")
                break
        }
    }, [sheet.stats['constitution'], armeManiement])

    // Binding
  /*  let bindingName = curr_weapon.weapon_name
    if(bindingName === undefined || bindingName === "") {
        bindingName = _("Weapon") + " " + entry.index()
    }
    Bindings.add(bindingName, "weapon_info", "weapon_binding", function() {
        return entry.value()
    })
    
    entry.find("weapon_info").on("click", function() {
        Bindings.send(entry.sheet(), bindingName)
    })*/
        
}

export const onArmeDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const armes = sheet.armes()
        delete armes[entryId]
        sheet.armes.set(armes)
    }
}