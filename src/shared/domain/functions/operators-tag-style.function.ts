export function operatorsTagStyle(operator: string): Record<string, string> {
    const backgroundColor = getOperatorColor(operator);
    const textColor = operator?.toLowerCase() === 'mtn' ? '#212121' : '#ffffff';
    return { backgroundColor, color: textColor };
}

function getOperatorColor(operator: string): string {
    const normalized = operator?.toLowerCase().trim() ?? '';
    const colorMap: Record<string, string> = {
        orange: 'rgb(241, 110, 0)',
        mtn: 'rgb(255, 203, 5)',
        moov: 'rgb(0, 91, 164)',
    };
    return colorMap[normalized] ?? `rgba(var(--theme-default-rgb), 0.8)`;
}
