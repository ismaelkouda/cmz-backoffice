import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class EncodingDataService {
    private readonly DEFAULT_ENCRYPTION_KEY = 'Im@k0';
    private readonly ENCRYPTION_PREFIX = 'enc:';

    constructor() {}

    /**
     * Sauvegarde des données dans le stockage local
     * @param key Clé de stockage
     * @param value Valeur à stocker
     * @param encrypt Indique si les données doivent être chiffrées
     */
    public saveData(key: string, value: any, encrypt: boolean = false): void {
        const serializedValue =
            typeof value === 'string' ? value : JSON.stringify(value);
        const processedValue = encrypt
            ? this.encrypt(serializedValue)
            : serializedValue;
        const storageValue = encrypt
            ? `${this.ENCRYPTION_PREFIX}${processedValue}`
            : processedValue;

        localStorage.setItem(key, storageValue);
    }

    /**
     * Récupère des données du stockage local
     * @param key Clé de stockage
     * @param defaultValue Valeur par défaut si non trouvée
     * @returns La valeur décryptée ou brute
     */
    public getData<T>(key: string, defaultValue: T | null = null): T | null {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;

        // Vérifie si les données sont chiffrées
        if (data.startsWith(this.ENCRYPTION_PREFIX)) {
            const encryptedData = data.substring(this.ENCRYPTION_PREFIX.length);
            const decrypted = this.decrypt(encryptedData);
            try {
                return JSON.parse(decrypted) as T;
            } catch {
                return decrypted as unknown as T;
            }
        } else {
            try {
                return JSON.parse(data) as T;
            } catch {
                return data as unknown as T;
            }
        }
    }

    /**
     * Récupère des données avec typage fort
     * @param key Clé de stockage
     * @param defaultValue Valeur par défaut
     * @returns La valeur typée
     */
    public getTypedData<T>(key: string, defaultValue: T): T {
        const data = this.getData<T>(key);
        return data !== null ? data : defaultValue;
    }

    public removeData(key: string): void {
        localStorage.removeItem(key);
    }

    public clearData(): void {
        localStorage.clear();
    }

    /**
     * Chiffre une valeur
     * @param value Valeur à chiffrer
     * @param customKey Clé personnalisée (optionnelle)
     * @returns Valeur chiffrée
     */
    public encrypt(value: string, customKey?: string): string {
        const key = customKey || this.DEFAULT_ENCRYPTION_KEY;
        return CryptoJS.AES.encrypt(value, key).toString();
    }

    /**
     * Déchiffre une valeur
     * @param encryptedValue Valeur chiffrée
     * @param customKey Clé personnalisée (optionnelle)
     * @returns Valeur déchiffrée
     */
    public decrypt(encryptedValue: string, customKey?: string): string {
        try {
            const key = customKey || this.DEFAULT_ENCRYPTION_KEY;
            const bytes = CryptoJS.AES.decrypt(encryptedValue, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    }

    /**
     * Vérifie si une clé existe dans le stockage
     * @param key Clé à vérifier
     */
    public hasKey(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Récupère toutes les clés du stockage local
     */
    public getAllKeys(): string[] {
        return Object.keys(localStorage);
    }

    /**
     * Supprime toutes les clés avec un préfixe spécifique
     * @param prefix Préfixe des clés à supprimer
     */
    public removeKeysWithPrefix(prefix: string): void {
        this.getAllKeys()
            .filter((key) => key.startsWith(prefix))
            .forEach((key) => this.removeData(key));
    }
}
