export function errors(error: string) {
    switch (true) {
        case error.includes('400'):
            return 'Missing Data: Need email';
            break
        default:
            return 'Error 500, something went wrong.'
    }
}