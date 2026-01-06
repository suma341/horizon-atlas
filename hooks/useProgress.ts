import { getUserProgressEntity, progressEntitiesToModels, ProgressEntity, ProgressModel, StorageEntity } from "@/lib/services/DriveService"
import { Profile } from "@/types/profile";
import { useEffect, useState } from "react"

const useProgress=(userProfile:Profile | null)=>{
  const [progress, setProgress] = useState<ProgressModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [cannotLoad, setCannotLoad] = useState(false);
  const [entity,setEntity] = useState<ProgressEntity[]>([])

  const getProgressKey=(studentNum:string)=>{
    return `atlas_progress_data-${studentNum}`
  }

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

  useEffect(() => {
    async function setData() {
      try{
        if (userProfile && userProfile.studentNum) {
          setLoading(true);
          const localItem = getFromLocalStorage(userProfile.studentNum)
          if(localItem){
            setEntity(localItem)
            const models = progressEntitiesToModels(localItem)
            setProgress(models)
            return;
          }
          const data = await getUserProgressEntity(userProfile.studentNum);
          if(data===null || data.length===0){
            setCannotLoad(true)
          }else{
            setEntity(data)
            const models = progressEntitiesToModels(data)
            setProgress(models)
            const now = new Date();
            const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
            const entity:StorageEntity = {
              progress:data,
              expired:fiveMinutesLater.getTime()
            }
            localStorage.setItem(getProgressKey(userProfile.studentNum),JSON.stringify(entity))
          }
        }else{
          setCannotLoad(true)
        }
      }catch(e){
        console.error("error:",e)
        setCannotLoad(true)
      }finally{
        setLoading(false);
      }
    }
    setData();
  }, [userProfile]);

  return {
    progress,
    loading,
    cannotLoad,
    entity
  }
}

export default useProgress