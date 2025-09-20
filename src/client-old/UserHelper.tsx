import { postHelper, instance, getHelper } from ".";

/** 用户 */
export async function postLogin(params: any): Promise<any | boolean> {
    const data = await postHelper(`/auth/login`, params);
    return data;
}

export async function checkLogin(): Promise<any> {
    const data = await postHelper(`/auth/checkLogin`);
    return data;
}

export async function postRefresh(): Promise<any | boolean> {
    if (localStorage.getItem("refresh_token")) {
        return await instance.post(
            "/auth/refresh",
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "refresh_token"
                    )}`,
                },
            }
        );
    } else {
        return false;
    }
}
