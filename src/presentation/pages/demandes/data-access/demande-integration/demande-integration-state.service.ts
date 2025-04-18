import { EncodingDataService } from './../../../../../shared/services/encoding-data.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DemandeIntegrationStateService {
    private filterState: any;
    private tableState: any[] = [];
    private tableItemSelectedState: any;
    private parginateState: any;

    constructor(private encodingDataService: EncodingDataService) {}

    setFilterState(state: any): void {
        this.filterState = state;
        this.encodingDataService.saveData('filterState', JSON.stringify(state));
    }

    getFilterState(): any {
        const savedState = this.encodingDataService.getData('filterState');
        this.filterState = savedState ? JSON.parse(savedState) : null;
        return this.filterState;
    }

    setTableState(state: any[]): void {
        this.tableState = state;
        this.encodingDataService.saveData('tableState', JSON.stringify(state));
    }

    getTableState(): any[] {
        const savedState = this.encodingDataService.getData('tableState');
        this.tableState = savedState ? JSON.parse(savedState) : [];
        return this.tableState;
    }

    setTableItemSelectedState(state: any): void {
        this.tableItemSelectedState = state;
        this.encodingDataService.saveData(
            'tableItemSelectedState',
            JSON.stringify(state)
        );
    }

    getTableItemSelectedState(): any {
        const savedState = this.encodingDataService.getData(
            'tableItemSelectedState'
        );
        this.tableItemSelectedState = savedState
            ? JSON.parse(savedState)
            : null;
        return this.tableItemSelectedState;
    }

    setParginateState(state: any): void {
        this.parginateState = state;
        this.encodingDataService.saveData(
            'parginateState',
            JSON.stringify(state)
        );
    }

    getParginateState(): any {
        const savedState = this.encodingDataService.getData('parginateState');
        this.parginateState = savedState ? JSON.parse(savedState) : null;
        return this.parginateState;
    }

    removeAllDemandeIntegrationState() {
        this.encodingDataService.removeData('filterState');
        this.encodingDataService.removeData('tableState');
        this.encodingDataService.removeData('tableItemSelectedState');
        this.encodingDataService.removeData('parginateState');
    }

    /**
     * Génère une chaîne de requête à partir d'un objet.
     *
     * @param dataFilter - Un objet contenant les filtres sous forme de paires clé-valeur.
     * @returns Une chaîne de requête encodée ou une chaîne vide si aucune donnée valide n'est présente.
     */
    generateQueryStringFromObject = (
        dataFilter: Record<string, any> = {}
    ): string => {
        const params = new URLSearchParams();

        Object.entries(dataFilter).forEach(([key, val]) => {
            if (key && val !== null && val !== undefined) {
                const encodedKey = encodeURIComponent(key);
                const encodedVal = encodeURIComponent(val.toString());
                params.append(encodedKey, encodedVal);
            }
        });

        return params.toString(); // Retourne la chaîne de requête générée ou une chaîne vide si aucun paramètre n'est valide
    };

    /**
     * Convertit une chaîne de requête en un objet.
     *
     * @param queryString - La chaîne de requête à analyser.
     * @returns Un objet représentant les paires clé-valeur de la chaîne de requête.
     */
    parseQueryStringToObject = (
        queryString: string
    ): Record<string, string | null> => {
        const filterObj: Record<string, string | null> = {};

        if (!queryString || queryString.trim() === '') {
            return filterObj; // Retourne un objet vide si la chaîne de requête est vide ou nulle
        }

        const params = new URLSearchParams(
            queryString.startsWith('?') ? queryString.substring(1) : queryString
        );

        params.forEach((value, key) => {
            filterObj[key] = value !== '' ? value : null; // Convertir une chaîne vide en null
        });

        return filterObj;
    };
}
