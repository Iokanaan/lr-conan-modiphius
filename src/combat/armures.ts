import { globalSheets } from "../globals"
import { rollD6 } from "../roll/handleRoll"
import { effect } from "../utils/utils"

export const onArmureDisplay = function(entry: Component<ArmureData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
    const armures = sheet.armures()
    const currArmure = entry.value()
    armures[entry.id()] = currArmure
    sheet.armures.set(armures)
    
    // Gestion qualites
    const qualiteLabels: string[] = []
    if(currArmure.armure_qualites !== undefined && currArmure.armure_qualites.length !== 0) {
        for(let q=0; q<currArmure.armure_qualites.length; q++) {
            const qualite = currArmure.armure_qualites[q]
            const qEntity = Tables.get("armures_qualites").get(qualite) as ArmureQualiteEntity
            qualiteLabels.push(qEntity.name)
        }
        entry.find("armure_qualites_label").value("**Qualités: **" + qualiteLabels.join(", "))
    } else {
        entry.find("armure_qualites_label").value("")
    }

    // Gestion Type Armure
    entry.find("armure_type_label").value(Tables.get("armures_types").get(currArmure.armure_type).name)

    // Gestion couverture
    const couvertureLabels: string[] = []
    if(currArmure.armure_couverture !== undefined && currArmure.armure_couverture.length !== 0) {
        for(let q=0; q<currArmure.armure_couverture.length; q++) {
            const couv = currArmure.armure_couverture[q]
            const qEntity = Tables.get("armures_couvertures").get(couv) as ArmureCouvertureEntity
            couvertureLabels.push(qEntity.name)
        }
        entry.find("armure_couverture_label").value("**Couvre: **" + couvertureLabels.join(", "))
    } else {
        entry.find("armure_couverture_label").value("")
    }

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

export const onArmureDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const armures = sheet.armures()
        delete armures[entryId]
        sheet.armures.set(armures)
    }
}

export const setupEncConditionnel = function(s: PcSheet) {
    s.find("couvert_roll").on("click", function() {
        if(s.find("couvert_val").value() !== undefined && s.find("couvert_val").value() as number > 0) {
            rollD6(s, s.find("couvert_val").value() as number + s.birdDice(), _("Couvert"))
        }
    })
    s.find("moral_roll").on("click", function() {
        if(s.find("moral_val").value() !== undefined && s.find("moral_val").value() as number > 0) {
            rollD6(s, s.find("moral_val").value() as number + s.birdDice(), _("Moral"))
        }
    })
}

export const setupArmorSchema = function(sheet: PcSheet) {
    effect(function() {
        const armorKeys = Object.keys(sheet.armures())
        const couvertures: Record<ArmureCouverture, number> = {
            "tete": 0,
            "torse": 0,
            "bras_g": 0,
            "bras_d": 0,
            "jambe_g": 0,
            "jambe_d": 0
        }
        const qualites: Record<string, null> = {}
        for(let a=0; a<armorKeys.length; a++) {
            const currArmor = sheet.armures()[armorKeys[a]]
            for(let c=0; c<currArmor.armure_couverture.length; c++) {
                if(currArmor.armure_valeur !== undefined) {
                    couvertures[currArmor.armure_couverture[c]] += currArmor.armure_valeur
                }
            }
            if(currArmor.armure_qualites !== undefined && currArmor.armure_qualites.length !== 0) {
                for(let q=0; q<currArmor.armure_qualites.length; q++) {
                    qualites[Tables.get("armures_qualites").get(currArmor.armure_qualites[q]).name as string] = null
                }
                sheet.find("armure_qualites_label").value("**Qualités**: " +  Object.keys(qualites).join(", "))
            } else {
                sheet.find("armure_qualites_label").value("")
            }
        }
        const couverturesKeys = Object.keys(couvertures)
        for(let a=0; a<couverturesKeys.length; a++) {
            sheet.find(couverturesKeys[a] + "_label").value(couvertures[couverturesKeys[a] as ArmureCouverture])
        }
    }, [sheet.armures])
}