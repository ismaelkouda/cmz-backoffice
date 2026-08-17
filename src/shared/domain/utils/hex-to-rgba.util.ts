/**
 * Convertit une couleur hexadécimale (#rrggbb) en chaîne rgba() avec
 * l'opacité donnée. Basé sur le helper équivalent de map.adapter.ts.
 * @param hex
 * @param alpha
 */
export function hexToRgba(hex: string, alpha: number): string {
    const value = hex.replace('#', '');
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
