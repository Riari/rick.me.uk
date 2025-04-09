import { ProjectStatus } from "../content/config"

export function statusToBadgeClass(status: string) {
    switch (status) {
        case ProjectStatus.Active:
            return 'badge badge--accent-4'
        case ProjectStatus.Complete:
            return 'badge badge--accent-2'
        case ProjectStatus.Archived:
            return 'badge badge--accent-3'
        default:
            return ''
    }
}