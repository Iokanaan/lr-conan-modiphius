import { stats } from "../globals"
import { signal } from "../utils/utils"

const updateHandler = function<T>(signal: Signal<T>) {
    return function(c: Component<T>) {
        signal.set(c.value())
    }           

}

export const minionSheet = function(sheet: Sheet): MinionSheet {
    log("[INFO] Start INIT for : " + sheet.properName())
    const _sheet = {} as MinionSheet
    _sheet.raw = function() { return sheet }
    _sheet.find = sheet.get
    _sheet.entryStates = {}

    // CMP
    const weapons = _sheet.find("weapons") as Component<Record<string, WeaponData>>
    const visibility = _sheet.find("visibility") as Component<Visibility>

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

    // weapons
    log("[INFO] Recording weapons for : " + sheet.properName())
    if(weapons.value() === undefined) {
        weapons.value({})
    }
    _sheet.weapons = signal(weapons.value())

    // visibility
    log("[INFO] Recording visibility for : " + sheet.properName())
    _sheet.visibility = signal(visibility.value())
    visibility.on("update", updateHandler(_sheet.visibility))

    return _sheet
}