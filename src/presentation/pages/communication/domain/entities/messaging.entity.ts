export interface MessagingEntity {
    id: string;
    reference: string;
    subject: string;
    object: string;
    status: string;
    createdAt: string;
    sender: {
        name: string;
        function: string;
        contact: string;
    };
    requester: {
        name: string;
    };
    hasAttachment: boolean;
    fileUrl?: string;
}
