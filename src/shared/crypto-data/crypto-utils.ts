export async function deriveKey(
    password: string,
    salt: Uint8Array
): Promise<CryptoKey> {
    const iterations = 100000;
    const algo = { name: 'AES-GCM', length: 256 };

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: iterations,
            hash: 'SHA-256',
        },
        keyMaterial,
        algo,
        false,
        ['encrypt', 'decrypt']
    );
}

export function toBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function fromBase64(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
