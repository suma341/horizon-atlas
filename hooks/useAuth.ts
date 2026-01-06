import useUserProfileStore from "@/stores/userProfile";
import useFirebaseUser from "./useFirebaseUser";
import { useCallback, useEffect, useState } from "react";
import UserDataSvc from "@/lib/services/userDataSvc";
import useNormalizedStore from "@/stores/profileNormalized";

export const useAuth=()=>{
    const {loading:authLoading,user} = useFirebaseUser();
    const { userProfile,setUserProfile } = useUserProfileStore();
    const {normalized,setNormalized} = useNormalizedStore()
    const [loading,setLoading] = useState(false);
    const [dotCount,setDotCount] = useState(0);

    const checkUser=useCallback(async()=>{
        try{
            setLoading(true)
            if (user) {
                if(!userProfile){
                    const user_ = await UserDataSvc.get(user.uid);
                    if(user_){
                        setUserProfile(user_)
                        setNormalized(true)
                    }
                }else{
                    if(!normalized){
                        await UserDataSvc.normalize(user.uid)
                        setNormalized(true)
                    }
                }
            }
        }finally{
            setLoading(false)
        }
    },[user,authLoading])

    useEffect(()=>{
        checkUser()
    },[checkUser])

    useEffect(() => {
        if(loading || authLoading){
        const interval = setInterval(() => {
            setDotCount(prev => (prev + 1) % 4) 
        }, 1000)

        return () => clearInterval(interval) 
        }
    }, [loading])

    return {
        dotCount,
        loading,
        userProfile
    }
}