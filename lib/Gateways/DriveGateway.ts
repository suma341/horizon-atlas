export const getDriveFileByFileId=async(fileId:string)=>{
    const res = await fetch(`https://horizon-atlas-railway-production.up.railway.app/getDrivefile/${fileId}`);
    const data = await res.json();
    return data;
}