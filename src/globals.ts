export const globalSheets: Record<number, PcSheet> = {}
export const competences: Record<Stat, Competence[]> = {
    'agilite': [ 'acrobatie', 'melee', 'furtivite' ], 
    'perception': [ 'intuition', 'observation', 'survie', 'vol'], 
    'constitution': [ 'athletisme', 'resistance' ],
    'coordination': [ 'parade', 'armes_distance', 'navigation'],
    'intelligence': ['alchimie', 'artisanat', 'soin', 'linguistique', 'culture', 'art_guerre'],
    'personnalite': [ 'dressage', 'commandement', 'conseil', 'persuasion', 'societe'],
    'volonte': [ 'discipline', 'sorcellerie']
}
export const tabs = [ 'competences', 'inventaire', 'talents', 'sorcellerie', 'personnage', 'parametres', 'combat' ]