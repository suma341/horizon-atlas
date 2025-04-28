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

// ⤵︎新しいほう
export const getDiriveSheet=async(fileId:string,sheetName:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDriveSheet/fileId/${fileId}/sheetName/${sheetName}`)
    const data = await res.json();
    return data;
}

export const userProgressGateway=async(fileId:string,sheetName:string,studentNumber:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDriveSheet/fileId/${fileId}/sheetName/${sheetName}/studentNumber/${studentNumber}`)
    if(!res.ok){
        return null
    }
    const data = await res.json();
    return data;
}