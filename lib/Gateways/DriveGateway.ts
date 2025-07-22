import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

// export const getDriveFileByFileId=async(fileId:string)=>{
//     const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDrivefile/${fileId}`);
//     const data = await res.json();
//     return data;
// }

// export const getUserData = async(fileId:string,userName:string,nameColumn:string)=>{
//     const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDrivefile/${fileId}/userName/${nameColumn}/${userName}`);
//     const data = await res.json();
//     return data;
// }

// export const getDiriveSheet=async(fileId:string,sheetName:string)=>{
//     const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/getDriveSheet/fileId/${fileId}/sheetName/${sheetName}`)
//     const data = await res.json();
//     return data;
// }

export const userProgressGateway=async(fileId:string,sheetName:string,studentNumber:string)=>{
    const res = await fetch(`${SUPABASE_URL}/functions/v1/userProgress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({fileId,sheetName,studentNumber})
        }
    )
    if(!res.ok){
        return null
    }
    const data = await res.json();
    return data;
}