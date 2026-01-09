
export class MapperUtils {

    static createEnumMap<const T extends Record<string, unknown>>(
        mapping: T
    ): ReadonlyMap<keyof T & string, T[keyof T]> {
        const map = new Map<keyof T & string, T[keyof T]>();

        for (const key in mapping) {
            if (Object.prototype.hasOwnProperty.call(mapping, key)) {
                map.set(key, mapping[key]);
            }
        }

        return map;
    }

    private readonly cache = new Map<string, unknown>();
    private readonly maxCacheSize = 1000;

    memoized<TInput, TOutput>(
        input: TInput | null | undefined,
        mapper: (input: TInput) => TOutput,
        key?: string
    ): TOutput | null {
        if (input == null) return null;

        const cacheKey = key ?? this.generateCacheKey(input);

        const cached = this.cache.get(cacheKey);
        if (cached !== undefined) {
            return cached as TOutput;
        }

        const result = mapper(input);
        this.setCache(cacheKey, result);
        return result;
    }

    memoizedList<TInput, TOutput>(
        inputs: readonly (TInput)[],
        mapper: (input: TInput) => TOutput,
        keyGenerator?: (input: TInput) => string
    ): Array<TOutput> {
        return inputs.map(input =>
            this.memoized(input, mapper, keyGenerator?.(input))!
        );
    }

    private setCache(key: string, value: unknown): void {
        this.cache.set(key, value);
        this.ensureCacheLimit();
    }

    private ensureCacheLimit(): void {
        if (this.cache.size <= this.maxCacheSize) return;

        const overflow = this.cache.size - this.maxCacheSize;
        const keysToDelete = Array.from(this.cache.keys()).slice(0, overflow);

        for (const key of keysToDelete) {
            this.cache.delete(key);
        }
    }

    private generateCacheKey(value: unknown): string {
        if (this.isIdentifiable(value)) {
            return `id:${value.constructor.name}:${value.id}`;
        }

        if (Array.isArray(value)) {
            return `arr:${value.length}`;
        }

        return `${typeof value}:${String(value)}`;
    }

    private isIdentifiable(
        value: unknown
    ): value is { id: string | number } {
        return (
            typeof value === 'object' &&
            value !== null &&
            'id' in value &&
            (value as any).id !== undefined
        );
    }

    /*     static validateDto(dto: unknown): asserts dto is BaseReportDto {
            if (!dto || typeof dto !== 'object') {
                throw new Error('Invalid DTO');
            }
    
            const required: (keyof BaseReportDto)[] = [
                'id',
                'state',
                'operators',
            ];
    
            for (const key of required) {
                if (!(key in dto)) {
                    throw new Error(`Missing field ${String(key)}`);
                }
            }
    
            if (!Array.isArray((dto as BaseReportDto).operators)) {
                throw new Error('operators must be an array');
            }
        } */

    static validateDto<T extends object>(
        dto: T,
        schema: {
            required?: readonly (keyof T)[];
            nullable?: readonly (keyof T)[];
        }
    ): void {
        if (schema.required) {
            this.validateRequiredFields(dto, schema.required);
        }
    }

    static validateRequiredFields<T extends object>(
        dto: T,
        fields: readonly (keyof T)[]
    ): void {
        const missing = fields.filter(
            f => dto[f] === undefined || dto[f] === null || dto[f] === ''
        );

        if (missing.length) {
            throw new Error(
                `Missing required fields: ${missing.join(', ')}`
            );
        }
    }

    clearCache(): void {
        this.cache.clear();
    }
}
