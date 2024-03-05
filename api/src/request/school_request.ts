export type CreateSchoolRequest = {
    name: string;
    prefecture_id: number;
    address: string;
};

export type UpdateSchoolRequest = {
    name?: string;
    prefecture_id?: number;
    address?: string;
};
