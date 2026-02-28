// Helper function that take string value remove space and make it lowercase
export function formatString(value: string) {
    return value.replace(/\s+/g, '').toLowerCase()
}

// Helper function that take string value remove space and make it lowercase and add - between them
export function formatStringWithDash(value: string): string {
    return value.replace(/\s+/g, '-').toLowerCase()
}