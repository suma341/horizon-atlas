export const getDriveFileByFileId=async(fileId:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDrivefile/${fileId}`);
    const data = await res.json();
    return data;
}