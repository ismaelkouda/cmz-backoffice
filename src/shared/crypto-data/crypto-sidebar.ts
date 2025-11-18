import { Injectable } from '@angular/core';
import { deriveKey, fromBase64, toBase64 } from './crypto-utils';

@Injectable({
    providedIn: 'root',
})
export class CryptoSidebar {
    private readonly password = 'Cs2&Ri0~Yd2#Pe5{';

    constructor() {}

    async saveSidebarData(
        key: string,
        value: string,
        token: string
    ): Promise<void> {
        // initialiser
        const encoder = new TextEncoder();
        //   commencer le process
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const aeskey = await deriveKey(`${this.password}+${token}`, salt);
        //  generer la clef de cryptage
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            aeskey,
            encoder.encode(value)
        );

        // Garder l'ensemble comme un string
        const data = {
            iv: toBase64(iv.buffer),
            salt: toBase64(salt.buffer),
            value: toBase64(encrypted),
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

    async getSidebarData(key: string, token: string): Promise<string | null> {
        // initialiser
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        //   reprendre le process a l'inverse
        try {
            const payload = JSON.parse(raw);
            const salt = fromBase64(payload.salt);
            const iv = fromBase64(payload.iv);
            const value = fromBase64(payload.value);

            const aeskey = await deriveKey(`${this.password}+${token}`, salt);
            //  generer la clef de decryptage
            const derypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv as BufferSource },
                aeskey,
                value as BufferSource
            );

            return new TextDecoder().decode(derypted);
        } catch (e) {
            console.log('echec de decryptage', e);
            return null;
        }
    }

    removeSidebarData(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
