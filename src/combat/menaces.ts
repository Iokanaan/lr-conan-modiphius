import { buildCrits } from "../roll/handleRoll"
import { basicUpdateHandler, computed, effect, signal } from "../utils/utils"

const switchableComp = function(s: PcSheet, menace: string, comp1: Competence, comp2: Competence) {
    const useComp2 = signal(s.find("menace_" + menace + "_use_" + comp2).value())
    const comp: Computed<Competence> = computed(function() {
        if(useComp2()) {
            return comp2
        } else {
            return comp1
        }
    }, [useComp2])
    effect(function() {
        if(useComp2()) {
            s.find("menace_" + menace + "_comp").value(_(s.find(comp2 + "_label").text()))
        } else {
            s.find("menace_" + menace + "_comp").value(_(s.find(comp1 + "_label").text()))
        }
    }, [useComp2])
    s.find("menace_" + menace + "_switch_comp").on("click", function() {
        if(s.find("menace_" + menace + "_use_" + comp2).value() === true) {
            s.find("menace_" + menace + "_use_" + comp2).value(false)
        } else {
            s.find("menace_" + menace + "_use_" + comp2).value(true)
        }
    })
    s.find("menace_" + menace + "_use_" + comp2).on("update", basicUpdateHandler(useComp2))
    return comp
}

export const rollMenaces = function(s: PcSheet) {

    const couteauGorgeComp = switchableComp(s, "couteau_gorge", "melee", "furtivite")
    const nomRedouteComp = switchableComp(s, "nom_redoute", "commandement", "discipline")
    const teindreSolRougeComp = switchableComp(s, "teindre_sol_rouge", "melee", "armes_distance")

    effect(function() {
        s.find("menace_nom_redoute_degats").value("Renommée (" + s.renommee() + " :ga_eagle-emblem:)")
    }, [s.renommee])

    s.find("menace_regard_acier").on("click", function(cmp) {
        rollMenace(s, "persuasion", 2, cmp.value() as string)
    })
    s.find("menace_couteau_gorge").on("click", function(cmp) {
        rollMenace(s, couteauGorgeComp(), 4, cmp.value() as string)
    })
    s.find("menace_force_titanesque").on("click", function(cmp) {
        rollMenace(s, "athletisme", 5, cmp.value() as string)
    })
    s.find("menace_nom_redoute").on("click", function(cmp) {
        rollMenace(s, nomRedouteComp(), s.renommee(), cmp.value() as string)
    })
    s.find("menace_regard_homme_mort").on("click", function(cmp) {
        rollMenace(s, "melee", 3, cmp.value() as string)
    })
    s.find("menace_sorcellerie_manifeste").on("click", function(cmp) {
        rollMenace(s, "sorcellerie", 5, cmp.value() as string)
    })
    s.find("menace_teindre_sol_rouge").on("click", function(cmp) {
        rollMenace(s, teindreSolRougeComp(), s.find("menace_teindre_sol_rouge_degats").value() as number, cmp.value() as string)
    })
    s.find("menace_tison_enflamme").on("click", function(cmp) {
        rollMenace(s, "survie", 3, cmp.value() as string)
    })
}

export const rollMenace = function(s: PcSheet, comp: Competence, degats: number, title: string) {
    const critData = buildCrits(s, comp)
    let expression = "(" + s.nbDice() + "d20 <=" + critData.expression + " " + s.competences[comp].vr() + ")[menace," + critData.tag + "]"
    expression += " + (" + (degats + s.bonus.menace() + s.bonus.tmpMenace()) + "d6 <={2:2,3:0,4:0} 6)[damage]"
    s.bonus.tmpMenace.set(0)
    new RollBuilder(s.raw())
        .expression(expression)
        .title(title)
        .roll()
}

export const setupMenaceBonus = function(s: PcSheet) {
    effect(function() {
        s.find("menace_bonus").value("**+" + s.bonus.menace() + "**")
    }, [s.bonus.menace])

    s.find("bonus_menace_tmp_min").on("click", function() {
        s.bonus.tmpMenace.set(s.bonus.tmpMenace() - 1)
    })
    s.find("bonus_menace_tmp_plus").on("click", function() {
        s.bonus.tmpMenace.set(s.bonus.tmpMenace() + 1)
    })
    effect(function() {
        if(s.bonus.tmpMenace() >= 0) {
            s.find("bonus_menace_tmp_label").value("**+" + s.bonus.tmpMenace() + "**")
            if(s.bonus.tmpMenace() === 0) {
                s.find("bonus_menace_tmp_label").removeClass("text-success")
            } else {
                s.find("bonus_menace_tmp_label").addClass("text-success")
            }
            s.find("bonus_menace_tmp_label").removeClass("text-danger")
        } else {
            s.find("bonus_menace_tmp_label").value("**" + s.bonus.tmpMenace() + "**")
            s.find("bonus_menace_tmp_label").removeClass("text-success")
            s.find("bonus_menace_tmp_label").addClass("text-danger")
        }
    }, [s.bonus.tmpMenace])
}