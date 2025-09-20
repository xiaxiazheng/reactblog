import { getHelper, postHelper } from ".";

export const getTranslate = async (keyword: string) => {
    const params = {
        keyword,
    };
    const data = await postHelper(`/translate/translate`, params);
    return data || false;
};

export async function getTranslateList(params: {
    keyword?: string,
    pageNo: number,
    pageSize?: number
    isMark?: number
}): Promise<any> {
    const data = await postHelper(`/translate/getTranslateList`, params);
    return data && data.resultsCode === "success" ? data.data : false;
}

export async function switchTranslateMark(
    translate_id: string,
    isMark: number
): Promise<boolean> {
    const params = {
        translate_id,
        isMark,
    };
    const data = await postHelper(`/translate/switchTranslateMark`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export const deleteTranslateItem = async (translate_id: string) => {
    const params = {
        translate_id,
    };
    const data = await postHelper(`/translate/deleteTranslateItem`, params);
    return data && data.resultsCode === "success" ? true : false;
};
