import { getProgressKey, getUserProgressEntity, ProgressEntity, StorageEntity } from "@/lib/services/DriveService";
import { Profile } from "@/types/profile";

const useCheckVisiblityAnswer=()=>{

    const getFromLocalStorage=(studentNum:string):ProgressEntity[] | null=>{
        const localItem = localStorage.getItem(getProgressKey(studentNum))
        if(localItem){
        try{
            const data:StorageEntity = JSON.parse(localItem)
            const isExpired = new Date().getTime() >= data.expired
            if(isExpired){
            return null
            }
            return data.progress
        }catch{
            return null
        }
        }
        return null
    }

    async function getData(userProfile:Profile):Promise<ProgressEntity[] | null> {
        try{
            if (userProfile && userProfile.studentNum) {
                const localItem = getFromLocalStorage(userProfile.studentNum)
                if(localItem){
                    return localItem;
                }
                const data = await getUserProgressEntity(userProfile.studentNum);
                if(data===null || data.length===0){
                    return null
                }else{
                    const now = new Date();
                    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
                    const entity:StorageEntity = {
                        progress:data,
                        expired:fiveMinutesLater.getTime()
                    }
                    localStorage.setItem(getProgressKey(userProfile.studentNum),JSON.stringify(entity))
                    return data
                }
            }else{
                return null
            }
        }catch(e){
            console.error("error:",e)
            return null
        }
    }

    return {
        getData
    }
}

export default useCheckVisiblityAnswer;