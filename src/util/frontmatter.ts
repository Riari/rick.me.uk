export function statusToBadgeClass(status: string) {
    switch (status) {
        case 'Active':
            return 'badge badge--primary-4'
        case 'Inactive':
            return 'badge badge--primary-3'
        case 'Complete':
            return 'badge badge--primary-2'
        default:
            return ''
    }
}