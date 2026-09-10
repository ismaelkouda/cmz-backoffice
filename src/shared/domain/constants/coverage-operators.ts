/**
 * Opérateurs de couverture et leurs couleurs.
 *
 * Source unique de vérité : avant, ce tableau était dupliqué dans
 * interactive-map.component.ts, table.component.ts et map.adapter.ts avec
 * des divergences (ex: `oci` coloré `#bfef45` sur la carte au lieu de
 * `#ff7900`). Les cercles de zones de couverture sur la carte doivent
 * toujours utiliser ces couleurs, identiques à celles de la légende.
 */
export interface CoverageOperator {
    id: string;
    label: string;
    color: string;
}

export const COVERAGE_OPERATORS: CoverageOperator[] = [
    { id: 'oci', label: 'OCI', color: '#ff7900' },
    { id: 'cit', label: 'CIT', color: '#ff7900' },
    { id: 'ihs (oci)', label: 'IHS (OCI)', color: '#ff7900' },
    { id: 'mtn', label: 'MTN', color: '#ffcc00' },
    { id: 'ihs (mtn)', label: 'IHS (MTN)', color: '#ffcc00' },
    { id: 'moov', label: 'Moov', color: '#005baa' },
    { id: 'moov (coloas)', label: 'Moov (Coloas)', color: '#005baa' },
    { id: 'idt', label: 'IDT', color: '#e6194B' },
    { id: 'ihs', label: 'IHS', color: '#bfef45' },
    { id: 'presidence', label: 'Présidence', color: '#4363d8' },
    { id: 'cafe mobile', label: 'Café Mobile', color: '#fabed4' },
    { id: 'green', label: 'Green', color: '#469990' },
];

/**
 * Résout la couleur d'un opérateur de couverture, ou une couleur de
 * repli (`#6b7280`) si l'opérateur est inconnu.
 * @param operator
 * @returns code hexadécimal ou rgba de la couleur de l'opérateur
 */
export function getCoverageOperatorColor(operator: string | undefined): string {
    return (
        COVERAGE_OPERATORS.find((op) => op.id === operator)?.color ?? '#6b7280'
    );
}
