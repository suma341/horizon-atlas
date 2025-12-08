import useUserProfileStore from "@/stores/userProfile";
import { useEffect, useState } from "react";

const useCheckRole=(visibility:string[] | "info")=>{
    const { userProfile } = useUserProfileStore();
    const [notVisible,setNotVisible] = useState(false);
    const [roleChecking,setRoleChecking] = useState(false)

    useEffect(()=>{
        const checkRole=async()=>{
            try{
                if(visibility==="info") {
                    if(!userProfile){
                        setNotVisible(true)
                    }else{
                        setNotVisible(false)
                    }
                }else{
                    const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト";
                    const isVisible = visibility.some((item)=>item===usersRole || item==="ゲスト")
                    if(!isVisible && usersRole!=="幹事長" && usersRole!=="技術部員"){
                        setNotVisible(true)
                    }else{
                        setNotVisible(false)
                    }
                }
            }finally{
                setRoleChecking(false)
                setNotVisible(false)
            }
        }
        checkRole()
    },[userProfile,visibility])

    return {
        notVisible,roleChecking
    }
}

export default useCheckRole