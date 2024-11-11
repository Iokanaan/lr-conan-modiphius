//@ts-check

declare global { 

    interface Signal<T> {
        (): T;
        set(t:T)
        subscribe(t:Handler<T>): () => void;
    }
    
    interface Computed<T> {
        (): T;
        subscribe(t:Handler<T>): () => void;
    }

    type Handler<T> = (t: T) => void

    type RepeaterState = 'EDIT' | 'VIEW'

    interface ExtendedSheet {
        raw(): Sheet,
        find(id: string): Component<unknown> | ChoiceComponent<unknown>,
        stringId(): string,
        entryStates: Record<string, Record<string, RepeaterState | undefined>>
    }

    type Stat = "might" | "edge" | "grit" | "wits"
    type Die = "4" | "6" | "8" | "10" | "12" | "20"
    type Range = "touch" | "short" | "medium" | "long"
    type WeaponType = "melee" | "ranged" | "thrown"
    type Visibility = "visible" | "gm" | "gmonly"
    type WeaponData = {
        weapon_name: string,
        weapon_type: WeaponType
        weapon_range: Range
        weapon_damage_dice_nb: number,
        weapon_damage_dice_type: Die,
        weapon_damage_bonus: number
        weapon_rules: string
    }
    type ArmorData = {
        armor_name: string,
        armor_ar: number
        armor_stipulations: string
    }
    type ItemData = {
        item_name: string,
        item_qty: number
    }

    type SkillData = {
        skill_name: string,
        skill_effect: string
    }

    type SpellData = {
        spell_name: string,
        spell_cost: string,
        spell_effect: string
    }

    type PcSheet = {
        name: Signal<string>,
        origin: {
            origin_name: Signal<string>,
            origin_bonus: Signal<string>
        },
        stats: Record<Stat, {
            value: Signal<number>,
            die: Signal<Die>
        }>,
        hp: {
            current: Signal<number>,
            max: Signal<number>
        }
        weapons: Signal<Record<string, WeaponData>>,
        armors: Signal<Record<string, ArmorData>>,
        skills: Signal<Record<string, SkillData>>,
        spells: Signal<Record<string, SpellData>>,
        ar_total: Computed<number>,
        defense: {
            physical: Signal<number>,
            magical: Signal<number>
        },
        items: Signal<Record<string, ItemData>>,
        flex: Signal<Die>,
        stamina: {
            current: Signal<number>,
            base: Computed<number>
        },
        sorcerer: Signal<boolean>,
        visibility: Signal<Visibility>

    } & ExtendedSheet

    type MinionSheet = {
        stats: Record<Stat, {
            value: Signal<number>,
            die: Signal<Die>
        }>,
        weapons: Signal<Record<string, WeaponData>>,
        visibility: Signal<Visibility>
    } & ExtendedSheet

    type AntagonistSheet = {
        stats: Record<Stat, {
            value: Signal<number>,
            die: Signal<Die>
        }>,
        weapons: Signal<Record<string, WeaponData>>,
        visibility: Signal<Visibility>
    } & ExtendedSheet
}

export {}
