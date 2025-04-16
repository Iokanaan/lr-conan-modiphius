import { mapArmeData } from "../combat/armes"
import { competences } from "../globals"
import { basicUpdateHandler, computed, signal } from "../utils/utils"



const computeVr = function(_sheet: PcSheet, stat: Stat, expSignal: Signal<number>) {
    return function() {
        return _sheet.stats[stat]() + expSignal()
    }
}

const getBonus = function(val: number) {
    if(val >= 16) {
        return 5
    }
    if(val >= 14) {
        return 4
    }
    if(val >= 12) {
        return 3
    }
    if(val >=10) {
        return 2
    }
    if(val === 9) {
        return 1
    }
    return 0
}

export const pcSheet = function(sheet: Sheet): PcSheet {
    log("[INFO] Start INIT for : " + sheet.properName())
    const _sheet = {} as PcSheet
    _sheet.raw = function() { return sheet }
    _sheet.find = sheet.get
    _sheet.entryStates = {}

    // CMP
    const renommeeCmp = _sheet.find("renommee") as Component<number>

    // DATA
    _sheet.nbDice = signal(2)
    _sheet.find("dice_plus").on("click", function() {
        if(_sheet.nbDice() < 5) {
            _sheet.nbDice.set(_sheet.nbDice() + 1)
        }   
    })
    _sheet.find("dice_min").on("click", function() {
        if(_sheet.nbDice() > 1) {
            _sheet.nbDice.set(_sheet.nbDice() - 1)
        }   
    })
    _sheet.birdDice = signal(0)
    _sheet.find("bird_plus").on("click", function() {
        _sheet.birdDice.set(_sheet.birdDice() + 1)
    })
    _sheet.find("bird_min").on("click", function() {
        _sheet.birdDice.set(_sheet.birdDice() - 1)
    })


    _sheet.stats = {} as any
    _sheet.competences = {} as any
    const stats = Object.keys(competences) as Stat[]
    for(let i=0; i<stats.length; i++) {
        const currStat = stats[i]
        const statCmp = _sheet.find(currStat + "_val") as Component<number>
        _sheet.stats[currStat] = signal(statCmp.value())
        statCmp.on("update", basicUpdateHandler(_sheet.stats[currStat]))
        for(let j=0; j<competences[currStat].length; j++) {
            const currComp = competences[currStat][j]
            const compConCmp = _sheet.find(currComp + "_con") as Component<number> 
            const conSignal = signal(compConCmp.value())
            compConCmp.on("update", basicUpdateHandler(conSignal))
            const compExpCmp = _sheet.find(currComp + "_exp") as Component<number> 
            const expSignal = signal(compExpCmp.value())
            compExpCmp.on("update", basicUpdateHandler(expSignal))
            _sheet.competences[currComp] = {
                'con': conSignal,
                'exp': expSignal,
                'vr': computed(computeVr(_sheet, currStat, expSignal), [_sheet.stats[currStat], expSignal]
                )
            }
        }
    }
    _sheet.armes = signal({})
    _sheet.armures = signal({})
    _sheet.talents = signal({})
    _sheet.spells = signal({})
    _sheet.alchimie = signal({})

    _sheet.bonus = {
        "melee": computed(function() {
            return getBonus(_sheet.stats["constitution"]())
        },[_sheet.stats["constitution"]]),
        "distance": computed(function() {
            return getBonus(_sheet.stats["perception"]())
        },[_sheet.stats["perception"]]),
        "menace": computed(function() {
            return getBonus(_sheet.stats["personnalite"]())
        },[_sheet.stats["personnalite"]])
    }

    _sheet.renommee = signal(renommeeCmp.value() !== undefined ? renommeeCmp.value() : 0)
    renommeeCmp.on("update", basicUpdateHandler(_sheet.renommee))

    // origin
    log("[INFO] Recording origin for : " + sheet.properName())

    return _sheet
}