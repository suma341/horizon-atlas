export const getUserProgressGW=async(fileId:string,sheetName:string,studentNumber:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/api/getSheet`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({fileId,sheetName,studentNumber})
    })
    if(!res.ok){
        return null;
    }
    const resData = await res.json();
    console.log("res",resData)
    const { error,data } = resData;
    if(error){
        console.error("error:",error)
        return null
    }
    return data
}