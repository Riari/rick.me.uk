import { ProjectStatus } from "../content/config"

export function statusToBadgeClass(status: string) {
    switch (status) {
        case ProjectStatus.Active:
            return 'badge badge--primary-4'
        case ProjectStatus.Complete:
            return 'badge badge--primary-2'
        case ProjectStatus.Archived:
            return 'badge badge--primary-3'
        default:
            return ''
    }
}