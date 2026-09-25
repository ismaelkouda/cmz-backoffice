export interface SlaCreateContract {
    name: string;
    description: string;
}

export const slaCreateContract = (
    name: string,
    description: string
): SlaCreateContract => ({
    name,
    description,
});
