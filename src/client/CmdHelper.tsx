import { getHelper, postHelper } from ".";

/** exec */
export async function exec(cmd: string): Promise<any> {
    const data = await postHelper(`/cmd/exec`, {
        cmd,
    });
    return data && data.resultsCode === "success" ? data.data : false;
}
