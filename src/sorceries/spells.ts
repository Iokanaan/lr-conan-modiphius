import { globalSheets } from "../globals"
import { handleStatRoll } from "../stats/stats"
import { basicUpdateHandler, computed, effect, signal } from "../utils/utils"

const showHideEffect = function(cmp: Component, exists: Signal<boolean>) {
    effect(function() {
        if(exists()) {
            cmp.show()
        } else {
            cmp.hide()
        }
    }, [exists])   
}

export const onSpellEdit = function(entry: Component<RawSpellData>) {
    const currSpell = mapSpellData(entry.value())
    
    const existsHeroismeSignals: Signal<boolean>[] = []
    for(let i=0; i<currSpell.heroisme_effet.length; i++) {
        existsHeroismeSignals.push(signal(currSpell.heroisme_effet[i].exists))
        showHideEffect(entry.find("heroisme_effet_" + (i+1)), existsHeroismeSignals[i])
        entry.find("heroisme_effet_" + (i+1) + "_exists").on("update", basicUpdateHandler(existsHeroismeSignals[i]))
    }

    const maxHeroisme = computed(function() {
        let nbExists = 0;
        for(let i=0; i<existsHeroismeSignals.length; i++) {
            if(existsHeroismeSignals[i]()) {
                nbExists++
            }
        }
        return nbExists
    }, existsHeroismeSignals)

    entry.find("heroisme_effet_plus").on("click", function() {
        if(maxHeroisme() < 10) {
            entry.find("heroisme_effet_" + (maxHeroisme() + 1) + "_exists").value(true)
        }
    })

    entry.find("heroisme_effet_min").on("click", function() {
        if(maxHeroisme() > 0) {
            entry.find("heroisme_effet_" + maxHeroisme() + "_exists").value(false)
        }
    })

    const existsAlternatifSignals: Signal<boolean>[] = []
    for(let i=0; i<currSpell.alternatif.length; i++) {
        existsAlternatifSignals.push(signal(currSpell.alternatif[i].exists))
        showHideEffect(entry.find("alternatif_" + (i+1)), existsAlternatifSignals[i])
        entry.find("alternatif_" + (i+1) + "_exists").on("update", basicUpdateHandler(existsAlternatifSignals[i]))
    }

    const maxAlternatif = computed(function() {
        let nbExists = 0;
        for(let i=0; i<existsAlternatifSignals.length; i++) {
            if(existsAlternatifSignals[i]()) {
                nbExists++
            }
        }
        return nbExists
    }, existsAlternatifSignals)

    entry.find("alternatif_plus").on("click", function() {
        if(maxAlternatif() < 10) {
            entry.find("alternatif_" + (maxAlternatif() + 1) + "_exists").value(true)
        }
    })

    entry.find("alternatif_min").on("click", function() {
        if(maxAlternatif() > 0) {
            entry.find("alternatif_" + maxAlternatif() + "_exists").value(false)
        }
    })

}

export const onSpellDisplay = function(entry: Component<RawSpellData>) {
    const s = globalSheets[entry.sheet().getSheetId()]
    const spells = s.spells()
    const currSpell = mapSpellData(entry.value())
    spells[entry.id()] = currSpell
    s.spells.set(spells)

    for(let i=1; i<=10; i++) {
        entry.find("heroisme_effet_" + i).hide()
    }

    entry.find("see_heroisme_effet").on("click", function() {
        if(entry.find("heroisme_effet_1").visible()) {
            for(let i=0; i<10; i++) {
                entry.find("heroisme_effet_" + (i+1)).hide()
            }
        } else {
            for(let i=0; i<currSpell.heroisme_effet.length; i++) {
                if(currSpell.heroisme_effet[i].exists) {
                    entry.find("heroisme_effet_" + (i+1)).show()
                } else {
                    entry.find("heroisme_effet_" + (i+1)).hide()
                }
            }
        }
    })

    entry.find("spell_nom_label").on("click", handleStatRoll(s, "sorcellerie", entry.find("spell_nom_label").text()))

    for(let i=1; i<=10; i++) {
        entry.find("alternatif_" + i).hide()
        entry.find("roll_alternatif_" + i).on("click", handleStatRoll(s, "sorcellerie", entry.find("roll_alternatif_" + i).text()))
    }

    entry.find("see_alternatif").on("click", function() {
        if(entry.find("alternatif_1").visible()) {
            for(let i=0; i<10; i++) {
                entry.find("alternatif_" + (i+1)).hide()
            }
        } else {
            for(let i=0; i<currSpell.alternatif.length; i++) {
                if(currSpell.alternatif[i].exists) {
                    entry.find("alternatif_" + (i+1)).show()
                } else {
                    entry.find("alternatif_" + (i+1)).hide()
                }
            }
        }
    })   
}

export const mapSpellData = function(rawSpellData: RawSpellData): SpellData {
    const spellData = {} as SpellData
    spellData.spell_nom = rawSpellData.spell_nom;
    spellData.spell_difficulte = rawSpellData.spell_difficulte
    spellData.spell_cout = rawSpellData.spell_cout
    spellData.spell_duree = rawSpellData.spell_duree
    spellData.spell_description = rawSpellData.spell_description
    spellData.heroisme_effet = [];
    for(let i=1; i<=10; i++) {
        spellData.heroisme_effet.push({
            exists: rawSpellData["heroisme_effet_" + i + "_exists"],
            type: rawSpellData["heroisme_effet_" + i + "_type"],
            pts: rawSpellData["heroisme_effet_" + i + "_pts"],
            effet: rawSpellData["heroisme_effet_" + i + "_effet"]
        })
    }
    spellData.alternatif = [];
    for(let i=1; i<=10; i++) {
        spellData.alternatif.push({
            exists: rawSpellData["alternatif_" + i + "_exists"],
            type: rawSpellData["alternatif_" + i + "_type"],
            difficulte: rawSpellData["alternatif_" + i + "_difficulte"],
            effet: rawSpellData["alternatif_" + i + "_effet"]
        })
    }
    return spellData
}

export const onSpellDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const spells = sheet.spells()
        delete spells[entryId]
        sheet.spells.set(spells)
    }
}
