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

    type Stat = "agilite" | "perception" | "constitution" | "coordination" | "intelligence" | "personnalite" | "volonte" 
    type Competence = 'acrobatie' | 'melee' | 'furtivite' | 'intuition' | 'observation' | 'survie' |
    'vol' | 'athletisme' | 'resistance' | 'parade' | 'armes_distance' | 'navigation' |
    'alchimie' | 'artisanat' | 'soin' | 'linguistique' | 'culture' | 'art_guerre' |
    'dressage' | 'commandement' | 'conseil' | 'persuasion' | 'societe' |
    'discipline' | 'vigilance' | 'sorcellerie'
    type Visibility = "visible" | "gm" | "gmonly"
   
    type ArmeQualiteEntity = {
        id: ArmeQualite,
        name: string,
        type: "Fixe" | "Variable"
    }

    type ArmeType = "melee" | "distance"
    type ArmePorte = "1" | "2" | "3" | "4" | "5" | "courte" | "moyenne" | "longue"
    
    type ArmeQualite = "AVE" | "BOU" | "CACH" | "CAV" | "CON" | "CRU" | "ETEN" | "ETOU" | "ETRE" | "FRA" | "IMP"  | "INC" | "INT" | "JET" | "LET" | "MAT" | "NLET" | "PAR" | "PERF" | "PERS" | "RED" | "SUB" | "VOL" | "ZON"

    type RawArmeData = {
        arme_degats: number,
        arme_type: ArmeType,
        arme_nom: string,
        arme_encombrement: number,
        arme_taille: ArmeTaille,
        arme_portee: ArmePorte,
        arme_charges: number,
        arme_qualites: ArmeQualite[],
        arme_BOU_lvl: number,
        arme_CACH_lvl: number,
        arme_CAV_lvl: number,
        arme_CON_lvl: number,
        arme_CRU_lvl: number,
        arme_ETEN_lvl: number,
        arme_INC_lvl: number,
        arme_LET_lvl: number,
        arme_PERF_lvl: number,
        arme_PERS_lvl: number,
        arme_RED_lvl: number,
        arme_SUB_lvl: number,
        arme_maniement_deux_mains: boolean
    }

    type ArmureQualiteEntity = {
        id: ArmureQualite,
        name: string
    }

    type ArmureCouvertureEntity = {
        id: ArmureCouverture,
        name: string
    }

    type ArmeData = {
        arme_nom: string,
        arme_type: ArmeType,
        arme_degats: number
        arme_encombrement: number,
        arme_taille: ArmeTaille,
        arme_portee: ArmePortee,
        arme_charges,
        arme_maniement_deux_mains: boolean,
        arme_qualites: Partial<Record<ArmeQualite, {
            niveau: number | undefined
        }>>
    }

    type ArmureType = "epais" | "legere" | "lourde" | "t_lourde"
    type ArmureQualite = "lourde" | "t_lourde" | "bruyante"
    type ArmureCouverture = "tete" | "torse" | "bras_g" | "bras_d" | "jambe_g" | "jambe_d"

    type TalentEntity = {
        id: string,
        name: string,
        max: string
    }

    type Talent = {
        id: string,
        name: string,
        max: number
    }

    type ArmureData = {
        armure_nom: string,
        armure_type: ArmureType,
        armure_valeur: number
        armure_encombrement: number,
        armure_qualites: ArmureQualite[],
        armure_couverture: ArmureCouverture[]
    }

    type TalentData = {
        talent_nom: string,
        talent_competence: Competence | "origine_caste" | "fortune",
        talent_niveau_max: number,
        talent_effet: string
    }

    type PcSheet = {
        stats: Record<Stat, Signal<number>>,
        nbDice: Signal<number>,
        competences: Record<Competence, {
            con: Signal<number>,
            exp: Signal<number>,
            vr: Computed<number>
        }>,
        bonus: {
            melee: Computed<number>,
            distance: Computed<number>,
            menace: Computed<number>,
            tmpDegats: Signal<number>,
            tmpMenace: Signal<number>
        }
        armes: Signal<Record<string, ArmeData>>,
        armures: Signal<Record<string, ArmureData>>,
        talents: Signal<Record<string, TalentData>>,
        visibility: Signal<Visibility>,
        renommee: Signal<number>

    } & ExtendedSheet
}

export {}
