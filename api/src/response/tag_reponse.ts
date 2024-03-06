interface ITag {
    id?: number;
    name?: string;
};

export type Tag = {
    id?: number;
    name?: string;
};

export type GetAllTagsResponse = {
    tags: Tag[];
};

export type GetTagByIDResponse = {
    tag: Tag;
};

export type GetTagsByKeywordResponse = {
    tags: Tag[];
};

export const newGetAllTagsResponse = (tags: ITag[]): GetAllTagsResponse => {
    return {
        tags: tags.map((tag) => {
            return {
                id: tag.id,
                name: tag.name,
            }
        }),
    };
};

export const newGetTagByIDResponse = (tag: ITag): GetTagByIDResponse => {
    return {
        tag: {
            id: tag.id,
            name: tag.name,
        }
    };
};

export const newGetTagsByKeywordResponse = (tags: ITag[]): GetTagsByKeywordResponse => {
    return {
        tags: tags.map((tag) => {
            return {
                id: tag.id,
                name: tag.name,
            }
        }),
    };
};
