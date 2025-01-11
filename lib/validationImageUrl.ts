export default async function isImageUrlValid(url:string) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // ステータスが200系かどうか
    } catch (error) {
        return false; // エラーが発生した場合は無効と判断
    }
}