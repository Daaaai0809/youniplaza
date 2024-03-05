interface ISchool {
    id: number;
    name: string;
    prefecture_id: number;
    address: string;
};

export type School = {
    id: number;
    name: string;
    prefecture_id: number;
    address: string;
};

export type GetAllSchoolsResponse = {
    schools: School[];
};

export type GetSchoolByIDResponse = {
    school: School;
};

export type GetSchoolsByKeywordResponse = {
    schools: School[];
};

export type getSchoolsByPrefectures = {
    schools: School[];
};

export const newGetSchoolsResponse = (schools: ISchool[]): GetAllSchoolsResponse => {
    return {
        schools
    }
};

export const newGetSchoolByIDResponse = (school: ISchool): GetSchoolByIDResponse => {
    return {
        school
    }
};

export const newGetSchoolsByKeywordResponse = (schools: ISchool[]): GetSchoolsByKeywordResponse => {
    return {
        schools
    }
};

export const newGetSchoolsByPrefecturesResponse = (schools: ISchool[]): getSchoolsByPrefectures => {
    return {
        schools
    }
};
