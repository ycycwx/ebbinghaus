export type Stage = 1 | 2 | 4 | 7 | 15 | 28 | 60 | 90 | 180 | 365 | 1_000_000_000;

export interface EbbinghausItem {
    id?: number;
    name: string;
    link?: string;
    desc?: string;
    createTime: number | Date;
    updateTime: number | Date;
    stage: Stage;
}
