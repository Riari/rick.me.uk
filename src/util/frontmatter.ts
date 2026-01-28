import { ProjectType } from "../content/config"

export function typeToBadgeClass(type: string) {
    switch (type) {
        case ProjectType.Game:
            return 'badge badge--accent-5'
        case ProjectType.Tool:
            return 'badge badge--accent-7'
        case ProjectType.Package:
            return 'badge badge--accent-2'
        case ProjectType.Website:
            return 'badge badge--accent-4'
        default:
            return ''
    }
}