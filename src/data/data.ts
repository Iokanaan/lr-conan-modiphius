import { computed } from "../utils/utils";

export const sheetData = function(sheet: PcSheet) {
    const data = computed(function() {
        log("[INFO] Reprocessing sheet " + sheet.raw().getSheetId())
        return {
            ar_total: sheet.ar_total()
        }
    }, [
        sheet.armors
    ])   

    computed(function() {
        sheet.raw().setData(data())
    }, [data])
}

