export function truncate(value: string, limit: number = 50)
{
    return value.length > limit ? value.substring(0, limit) + '...' : value;
}