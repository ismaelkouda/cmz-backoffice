import { Injectable } from '@angular/core';

@Injectable()

export class CarteSimStateService {
    private filterCarteSimState: any;
    private currentPageCarteSimState: any;
    private itemSelectedState: Object|null;

    /**
     * @function setFilterCarteSimState garde et returner des données du filtre sous form de string
     * @param state les données du filtre
     * @returns return les données du filtre sous forme de string
     */
    setFilterCarteSimState(state: any): string {
        return this.generateQueryStringFromObject(state)
    }
    /**
     * @function getFilterCarteSimState rtransform les données du filtre de string => object
     * @param state les données du filtre
     * @returns return les données du filtre sous forme d'object
     */
    // garde l'etat des données du filtre sous form de string
    getFilterCarteSimState(state?: any): Record<string, string | null>  {
        this.filterCarteSimState = state ?? this.filterCarteSimState;
        return this.parseQueryStringToObject(this.filterCarteSimState ?? state)
    }

    setCurrentPageCarteSimState(state: any): void {
        this.currentPageCarteSimState = state;
    }

    getCurrentPageCarteSimState(): any {
        return this.currentPageCarteSimState;
    }

    setItemSelectedState(state: Object|undefined): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): Object|null {
        return this.itemSelectedState;
    }

    clearCarteSim(): any {
        this.filterCarteSimState = null;
        this.currentPageCarteSimState = null;
        this.itemSelectedState = null;
    }

    /**
     * Génère une chaîne de requête à partir d'un objet.
     * 
     * @param dataFilter - Un objet contenant les filtres sous forme de paires clé-valeur.
     * @returns Une chaîne de requête encodée ou une chaîne vide si aucune donnée valide n'est présente.
     */
    public generateQueryStringFromObject = (dataFilter: Record<string, any> = {}): string => {
        const params = new URLSearchParams();
        if(dataFilter) {
            Object.entries(dataFilter).forEach(([key, val]) => {
                if (key && val !== null && val !== undefined) {
                    const encodedKey = encodeURIComponent(key);
                    const encodedVal = encodeURIComponent(val.toString());
                    params.append(encodedKey, encodedVal);
                }
            });
        }

        this.filterCarteSimState = params.toString(); // Retourne la chaîne de requête générée ou une chaîne vide si aucun paramètre n'est valide
        return params.toString();
    };

    /**
     * Convertit une chaîne de requête en un objet.
     * 
     * @param queryString - La chaîne de requête à analyser.
     * @returns Un objet représentant les paires clé-valeur de la chaîne de requête.
     */
    private parseQueryStringToObject = (queryString: string): Record<string, string | null> => {
        const filterObj: Record<string, string | null> = {};

        if (!queryString || typeof queryString !== 'string' ||  queryString.trim() === '') {
            return filterObj; // Retourne un objet vide si la chaîne de requête est vide ou nulle
        }

        const params = new URLSearchParams(queryString.startsWith('?') ? queryString.substring(1) : queryString);

        params.forEach((value, key) => {
            filterObj[decodeURIComponent(key)] = value !== '' ? decodeURIComponent(value) : null; // Convertir une chaîne vide en null
        });

        return filterObj;
    };

}