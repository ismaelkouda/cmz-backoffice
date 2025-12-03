import { Injectable } from '@angular/core';
import { deriveKey, fromBase64, toBase64 } from './crypto-utils';

@Injectable({
    providedIn: 'root',
})
export class CryptoToken {
    private readonly password = 'Ct2&Ro0~Yk2#Pe5{';

    constructor() { }

    async saveTokenData(key: string, value: string): Promise<void> {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const aeskey = await deriveKey(`${this.password}`, salt);
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            aeskey,
            encoder.encode(value)
        );

        const data = {
            iv: toBase64(iv.buffer),
            salt: toBase64(salt.buffer),
            value: toBase64(encrypted),
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

    async getTokenData(key: string): Promise<string | null> {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            const payload = JSON.parse(raw);
            const salt = fromBase64(payload.salt);
            const iv = fromBase64(payload.iv);
            const value = fromBase64(payload.value);

            const aeskey = await deriveKey(`${this.password}`, salt);
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

    removeTokenData(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
