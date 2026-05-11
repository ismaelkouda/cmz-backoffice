export function formatDateSafe(dateString: Date): string {
    if (!dateString) {
        return '-';
    }

    const date = new Date(dateString);

    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export function parseFrenchDate(dateString: string): Date | null {
    if (!dateString) {
        return null;
    }

    const [datePart, timePart] = dateString.split(' ');

    if (!datePart || !timePart) {
        return null;
    }

    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
}
