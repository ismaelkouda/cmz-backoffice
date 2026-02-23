export interface ResourceState<T> {
    data: T | null;
    loading: boolean;
    error: unknown | null;
    lastFetch: number;
}
