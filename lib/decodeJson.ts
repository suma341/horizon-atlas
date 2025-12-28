// use server
import { gunzip } from "zlib";
import { promisify } from "util";

const gunzipAsync = promisify(gunzip);

export async function decodeJson<T>(encoded: string): Promise<T> {
    const jsonStr = await gzipBase64Decode(encoded);
    return unmarshalJsonStr<T>(jsonStr);
}

function unmarshalJsonStr<T>(jsonStr: string): T {
    return JSON.parse(jsonStr) as T;
}

async function gzipBase64Decode(encoded: string): Promise<string> {
    const compressed = Buffer.from(encoded, "base64");
    const decodedBuffer = await gunzipAsync(compressed);

    return decodedBuffer.toString("utf-8");
}
