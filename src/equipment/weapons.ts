import { globalSheets } from "../globals"
import { effect, signal } from "../utils/utils"

export const onWeaponEdit = function(entry: Component<WeaponData>) {
    if(entry.value().weapon_damage_dice_nb === undefined) {
        entry.find("weapon_damage_dice_nb").value(1)
    }
    if(entry.value().weapon_damage_dice_type === undefined) {
        entry.find("weapon_damage_dice_type").value(6) 
    }
    if(entry.value().weapon_damage_bonus === undefined) {
        entry.find("weapon_damage_bonus").value(0) 
    }

    const weapon_type = signal(entry.find("weapon_type").value() as WeaponType)
    entry.find("weapon_type").on("update", function(cmp) {
        weapon_type.set(cmp.value())
    })

    effect(function() {
        if(weapon_type() === "melee") {
            entry.find("weapon_type_int").value(1)
        } else if (weapon_type() === "thrown") {
            entry.find("weapon_type_int").value(2)
        } else {
            entry.find("weapon_type_int").value(3)
        }
    }, [weapon_type])
}

export const onWeaponDisplay = function(entry: Component<WeaponData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
    const weapons = sheet.weapons()
    const curr_weapon = entry.value()
    weapons[entry.id()] = curr_weapon
    sheet.weapons.set(weapons)

    entry.find("roll_damage").on("click", function() {
        let bonus = curr_weapon.weapon_damage_bonus
        if(curr_weapon.weapon_type === "melee" || curr_weapon.weapon_type === "thrown") {
            bonus += sheet.stats['might'].value()
        }
        let expression = "(" + curr_weapon.weapon_damage_dice_nb + "d" + curr_weapon.weapon_damage_dice_type + " + " + bonus + ")[auto,damage]"
        if((sheet as PcSheet).flex !== undefined) {
            expression += " + 1d" + (sheet as PcSheet).flex() + "[flex]"
        }
        log("[INFO] Rolling : " + expression)
        new RollBuilder(sheet.raw())
            .expression(expression)
            .title(entry.find("roll_damage").text())
            .visibility(sheet.visibility())
            .roll()
    })
    if(_(Tables.get("weapon_range").get(curr_weapon.weapon_range).name) !== entry.find("weapon_range_label").value()) {
        entry.find("weapon_range_label").value(_(Tables.get("weapon_range").get(curr_weapon.weapon_range).name))
    }

    // Binding
    let bindingName = curr_weapon.weapon_name
    if(bindingName === undefined || bindingName === "") {
        bindingName = _("Weapon") + " " + entry.index()
    }
    Bindings.add(bindingName, "weapon_info", "weapon_binding", function() {
        return entry.value()
    })
    
    entry.find("weapon_info").on("click", function() {
        Bindings.send(entry.sheet(), bindingName)
    })
        
}

export const onWeaponDelete = function(sheet: PcSheet | MinionSheet) {
    return function(entryId: string) {
        const weapons = sheet.weapons()
        delete weapons[entryId]
        sheet.weapons.set(weapons)
    }
}