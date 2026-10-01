export interface SlaEscalationContactEntity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneSecondary: string | null;
    jobTitle: string;
    isActive: boolean;
    categories: string[];
    createdAt: string;
    updatedAt: string;
}
