import { stats } from "../globals"
import { signal, computed } from "../utils/utils"

const updateHandler = function<T>(signal: Signal<T>) {
    return function(c: Component<T>) {
        signal.set(c.value())
    }           

}

export const pcSheet = function(sheet: Sheet): PcSheet {
    log("[INFO] Start INIT for : " + sheet.properName())
    const _sheet = {} as PcSheet
    _sheet.raw = function() { return sheet }
    _sheet.find = sheet.get
    _sheet.entryStates = {}

    // CMP
    const origin_name = _sheet.find('origin_name') as Component<string>
    const origin_bonus = _sheet.find('origin_bonus') as Component<string> 
    const hp_current = _sheet.find("hp_current") as Component<number> 
    const hp_max = _sheet.find("hp_max") as Component<number>
    const weapons = _sheet.find("weapons") as Component<Record<string, WeaponData>>
    const armors = _sheet.find("armors") as Component<Record<string, ArmorData>>
    const skills = _sheet.find("skills_r") as Component<Record<string, SkillData>>
    const spells = _sheet.find("sorcery_r") as Component<Record<string, SpellData>>
    const items = _sheet.find("items") as Component<Record<string, ItemData>>
    const defense_physical = _sheet.find("defense_physical") as Component<number>
    const defense_magical = _sheet.find("defense_magical") as Component<number>
    const flex = _sheet.find("flex") as Component<Die>
    const stamina = _sheet.find("stamina") as Component<number>
    const sorcerer = _sheet.find("sorcerer") as Component<boolean>
    const visibility = _sheet.find("visibility") as Component<Visibility>

    // DATA
    
    // origin
    log("[INFO] Recording origin for : " + sheet.properName())
    _sheet.origin = {
        origin_name: signal(origin_name.value()),
        origin_bonus: signal(origin_bonus.value())
    }
    origin_name.on("update", updateHandler<string>(_sheet.origin.origin_name))
    origin_bonus.on("update", updateHandler<string>(_sheet.origin.origin_bonus))
    // stats
    log("[INFO] Recording stats for : " + sheet.properName())
    _sheet.stats = {} as any
    for(let i=0; i<stats.length; i++) {
        const stat_value = _sheet.find(stats[i] + "_value") as Component<number>
        const stat_die = _sheet.find(stats[i] + "_die") as Component<Die>
        _sheet.stats[stats[i]] = {
            value: signal(stat_value.value()),
            die: signal(stat_die.value())
        }
        stat_value.on("update", updateHandler<number>(_sheet.stats[stats[i]].value))
        stat_die.on("update", updateHandler<Die>(_sheet.stats[stats[i]].die))
    }
    // hp
    log("[INFO] Recording hp for : " + sheet.properName())
    _sheet.hp = {
        current: signal(hp_current.value()),
        max: signal(hp_max.value())
    }
    hp_current.on("update", updateHandler<number>(_sheet.hp.current))
    hp_max.on("update", updateHandler<number>(_sheet.hp.max))

    // weapons
    log("[INFO] Recording weapons for : " + sheet.properName())
    if(weapons.value() === undefined) {
        weapons.value({})
    }
    _sheet.weapons = signal(weapons.value())

    // armors
    log("[INFO] Recording armors for : " + sheet.properName())
    if(armors.value() === undefined) {
        armors.value({})
    }
    _sheet.armors = signal(armors.value())
    _sheet.ar_total = computed(function() {
        log("[INFO] Process AR for : " + sheet.properName())
        if(_sheet.armors() === undefined) {
            return 0
        }
        const values = Object.values(_sheet.armors())
        let ar_total = 0
        for(let i=0; i<values.length; i++) {
            ar_total += values[i].armor_ar
        }
        return ar_total
    }, [_sheet.armors])

    // items
    log("[INFO] Recording items for : " + sheet.properName())
    if(items.value() === undefined) {
        items.value({})
    }
    _sheet.items = signal(items.value())

    // skills
    log("[INFO] Recording skills for : " + sheet.properName())
    if(skills.value() === undefined) {
        skills.value({})
    }
    _sheet.skills = signal(skills.value())

    // sorcery skills
    log("[INFO] Recording spells for : " + sheet.properName())
    if(spells.value() === undefined) {
        spells.value({})
    }
    _sheet.spells = signal(spells.value())

    // defense
    log("[INFO] Recording defense for : " + sheet.properName())
    _sheet.defense = {
        physical: signal(defense_physical.value()),
        magical: signal(defense_magical.value())
    }
    defense_physical.on("update", updateHandler(_sheet.defense.physical))
    defense_magical.on("update", updateHandler(_sheet.defense.magical))

    // flex
    log("[INFO] Recording flex for : " + sheet.properName())
    _sheet.flex = signal(flex.value())
    flex.on("update", updateHandler(_sheet.flex))

    // stamina
    log("[INFO] Recording stamina for : " + sheet.properName())
    _sheet.stamina = {
        current: signal(stamina.value()),
        base: computed(function() {
            return _sheet.stats['grit'].value() 
        }, [_sheet.stats['grit'].value])
    }
    stamina.on("update", updateHandler(_sheet.stamina.current))

    // sorcerer
    log("[INFO] Recording parameters for : " + sheet.properName())
    _sheet.sorcerer = signal(sorcerer.value())
    sorcerer.on("update", updateHandler(_sheet.sorcerer))

    // visibility
    log("[INFO] Recording visibility for : " + sheet.properName())
    _sheet.visibility = signal(visibility.value())
    visibility.on("update", updateHandler(_sheet.visibility))

    return _sheet
}