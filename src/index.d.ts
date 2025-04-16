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

    type SpellHeroisme = {
        exists: boolean,
        type: string,
        pts: number,
        effet: string
    }

    type SpellAlternatif = {
        exists: boolean
        type: string,
        difficulte: number,
        effet: string
    }

    type AlchimieQualite = "AVE" | "ETEN" | "ETOU" | "INC" | "RED" | "NLET" | "ZON" | "PERS" | "PERF"

    type AlchimieQualiteEntity = {
        id: AlchimieQualite,
        name: string,
        type: string
    }

    type AlchimieType = "poudre_explosive" | "poudre_aveuglante" | "liquide_incendiaire" | "tissu" | "verre" | "talisman" | "pollen"

    type AlchimieForme = "Poudre" | "Liquide" | "Gaz"

    type RawAlchimieData = {
        alchimie_nom: string,
        alchimie_type: AlchimieType,
        alchimie_difficulte: number,
        alchimie_degats: number,
        alchimie_couvert: number,
        alchimie_courage: number,
        alchimie_handicap: string,
        alchimie_effets: string,
        alchimie_qualites: AlchimieQualite[],
        alchimie_ETEN_lvl: number,
        alchimie_INC_lvl: number,
        alchimie_RED_lvl: number,
        alchimie_forme: AlchimieForme
    }

    type AlchimieData = {
        alchimie_nom: string,
        alchimie_type: AlchimieType,
        alchimie_difficulte: number,
        alchimie_degats: number,
        alchimie_couvert: number,
        alchimie_courage: number,
        alchimie_handicap: string,
        alchimie_effets: string,
        alchimie_forme: AlchimieForme
        alchimie_qualites: Partial<Record<AlchimieQualite, {
            niveau: number | undefined
        }>>
    }
    
    type SpellData = {
        spell_nom: string,
        spell_difficulte: string,
        spell_cout: string,
        spell_duree: string,
        spell_description: string,
        heroisme_effet: SpellHeroisme[],
        alternatif: SpellAlternatif[]
    }

    type RawSpellData = {
        spell_nom: string,
        spell_difficulte: string,
        spell_cout: string,
        spell_duree: string,
        spell_description: string,
        heroisme_effet_1_exists: boolean,
        heroisme_effet_1_type: string,
        heroisme_effet_1_pts: string,
        heroisme_effet_2_exists: boolean,
        heroisme_effet_1_effet: string,
        heroisme_effet_2_type: string,
        heroisme_effet_2_pts: string,
        heroisme_effet_2_effet: string,
        heroisme_effet_3_exists: boolean,
        heroisme_effet_3_type: string,
        heroisme_effet_3_pts: string,
        heroisme_effet_3_effet: string,
        heroisme_effet_4_exists: boolean,
        heroisme_effet_4_type: string,
        heroisme_effet_4_pts: string,
        heroisme_effet_4_effet: string,
        heroisme_effet_5_exists: boolean,
        heroisme_effet_5_type: string,
        heroisme_effet_5_pts: string,
        heroisme_effet_5_effet: string,
        heroisme_effet_6_exists: boolean,
        heroisme_effet_6_type: string,
        heroisme_effet_6_pts: string,
        heroisme_effet_6_effet: string,
        heroisme_effet_7_exists: boolean,
        heroisme_effet_7_type: string,
        heroisme_effet_7_pts: string,
        heroisme_effet_7_effet: string,
        heroisme_effet_8_exists: boolean,
        heroisme_effet_8_type: string,
        heroisme_effet_8_pts: string,
        heroisme_effet_8_effet: string,
        heroisme_effet_9_exists: boolean,
        heroisme_effet_9_type: string,
        heroisme_effet_9_pts: string,
        heroisme_effet_9_effet: string,
        heroisme_effet_10_exists: boolean,
        heroisme_effet_10_type: string,
        heroisme_effet_10_pts: string,
        heroisme_effet_10_effet: string,
        alternatif_1_exists: boolean,
        alternatif_1_type: string,
        alternatif_1_difficulte: number,
        alternatif_1_effet: string,
        alternatif_2_exists: boolean,
        alternatif_2_type: string,
        alternatif_2_difficulte: number,
        alternatif_2_effet: string,
        alternatif_3_exists: boolean,
        alternatif_3_type: string,
        alternatif_3_difficulte: number,
        alternatif_3_effet: string,
        alternatif_4_exists: boolean,
        alternatif_4_type: string,
        alternatif_4_difficulte: number,
        alternatif_4_effet: string,
        alternatif_5_exists: boolean,
        alternatif_5_type: string,
        alternatif_5_difficulte: number,
        alternatif_5_effet: string,
        alternatif_6_exists: boolean,
        alternatif_6_type: string,
        alternatif_6_difficulte: number,
        alternatif_6_effet: string,
        alternatif_7_exists: boolean,
        alternatif_7_type: string,
        alternatif_7_difficulte: number,
        alternatif_7_effet: string,
        alternatif_8_exists: boolean,
        alternatif_8_type: string,
        alternatif_8_difficulte: number,
        alternatif_8_effet: string,
        alternatif_9_exists: boolean,
        alternatif_9_type: string,
        alternatif_9_difficulte: number,
        alternatif_9_effet: string,
        alternatif_10_exists: boolean,
        alternatif_10_type: string,
        alternatif_10_difficulte: number,
        alternatif_10_effet: string,

    }

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
        birdDice: Signal<number>,
        competences: Record<Competence, {
            con: Signal<number>,
            exp: Signal<number>,
            vr: Computed<number>
        }>,
        bonus: {
            melee: Computed<number>,
            distance: Computed<number>,
            menace: Computed<number>
        }
        armes: Signal<Record<string, ArmeData>>,
        armures: Signal<Record<string, ArmureData>>,
        talents: Signal<Record<string, TalentData>>,
        visibility: Signal<Visibility>,
        renommee: Signal<number>,
        spells: Signal<Record<string, SpellData>>,
        alchimie: Signal<Record<string, AlchimieData>>

    } & ExtendedSheet
}

export {}
