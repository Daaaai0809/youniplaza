export type CreateSpotRequest = {
    name: string;
    address: string;
    prefecture_id: number;
    tag_ids: number[];
};

export type UpdateSpotRequest = {
    name?: string;
    address?: string;
    prefecture_id?: number;
    tag_ids?: number[];
};
