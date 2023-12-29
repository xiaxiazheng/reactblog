import { getHelper, postHelper } from ".";

/** 操作 settings */
export async function getSettings(): Promise<any> {
    const data = await getHelper(`/settings/getSettings`);
    return data && data.resultsCode === "success" ? data.data : false;
}

export async function getSettingsList(): Promise<any> {
    const data = await getHelper(`/settings/getSettingsList`);
    return data && data.resultsCode === "success" ? data.data : false;
}

export async function addSettings(params: {
    name: string;
    value: any;
}): Promise<any> {
    const data = await postHelper(`/settings/addSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export async function updateSettings(params: {
    settings_id: string;
    name: string;
    value: any;
}): Promise<any> {
    const data = await postHelper(`/settings/updateSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}

export async function deleteSettings(params: {
    settings_id: string;
}): Promise<any> {
    const data = await postHelper(`/settings/deleteSettings`, params);
    return data && data.resultsCode === "success" ? true : false;
}
