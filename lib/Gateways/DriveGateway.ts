export const getDriveFileByFileId=async(fileId:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDrivefile/${fileId}`);
    const data = await res.json();
    return data;
}

export const getUserData = async(fileId:string,userName:string,nameColumn:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDrivefile/${fileId}/userName/${nameColumn}/${userName}`);
    const data = await res.json();
    return data;
}