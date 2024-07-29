export function statusToBadgeClass(status: string) {
    switch (status) {
        case 'Active':
            return 'badge badge--primary-2'
        case 'Inactive':
            return 'badge badge--primary-3'
        default:
            return ''
    }
}