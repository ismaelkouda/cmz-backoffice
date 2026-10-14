export interface SlaUpdateContract {
    id: string;
    name: string;
    description: string;
}

export const slaUpdateContract = (
    id: string,
    name: string,
    description: string
): SlaUpdateContract => ({
    id,
    name,
    description,
});
