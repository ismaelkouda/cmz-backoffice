export interface ApprovalInfo {
    approvedBy: string | null;
    approvedAt: string | null;
    rejectedBy: string | null;
    rejectedAt: string | null;
    approvedComment: string | null;
    confirmCount: number;
    denyCount: number;
}
