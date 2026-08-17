export function separatorThousands(
    value: number | string,
    locale = 'fr-FR'
): string {
    const number = Number(value) || 0;
    return new Intl.NumberFormat(locale).format(number);
}
