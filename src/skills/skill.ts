import { globalSheets } from "../globals"

export const onSkillDisplay = function(entry: Component<SkillData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()] as PcSheet
    const skills = sheet.skills()
    const curr_skill = entry.value()
    skills[entry.id()] = curr_skill
    sheet.skills.set(skills)

    // Binding
    let bindingName = entry.value().skill_name
    if(bindingName === undefined || bindingName === "") {
        bindingName = _("Skill") + " " + entry.index()
    }
    Bindings.add(bindingName, "skill_info", "skill_binding", function() {
        return entry.value()
    })
    
    entry.find("skill_info").on("click", function() {
        Bindings.send(entry.sheet(), bindingName)
    })
        
}

export const onSkillDelete = function(sheet: PcSheet) {
    return function(entryId: string) {
        const skills = sheet.skills()
        delete skills[entryId]
        sheet.skills.set(skills)
    }
}