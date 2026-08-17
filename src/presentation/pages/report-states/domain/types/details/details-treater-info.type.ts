export interface DetailsTreaterInfo {
    acknowledgedAt: string | null;
    createdAt: string;
    reportedAt: string;
    processedAt: string | null;
    approvedAt: string | null;
    finalizedAt: string | null;
    rejectedAt: string | null;
    confirmedAt: string | null;
    abandonedAt: string | null;
    processedComment: string | null;
    approvedComment: string | null;
    rejectedComment: string | null;
    acknowledgedComment: string | null;
    confirmedComment: string | null;
    abandonedComment: string | null;
    denyCount: number;
    reason: string | null;
    callbackType: string | null;
}
