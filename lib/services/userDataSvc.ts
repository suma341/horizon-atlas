import { Profile } from "@/types/profile"
import UserDataGW from "../Gateways/userDataGW"
import { fetchUser, saveUserProfile } from "../Gateways/fireStore"

export default class UserDataSvc{
    static save=async(profile:Profile)=>{
        await UserDataGW.save(profile)
        await saveUserProfile(profile)
    }

    static get=async(user_id:string):Promise<null | Profile>=>{
        const profile = await UserDataGW.get(user_id)
        if(profile){
            if(!profile.studentNum){
                const profileFromFireStore = await fetchUser(user_id)
                if(profileFromFireStore && profileFromFireStore.studentNum){
                    await UserDataGW.save(profileFromFireStore)
                    return profileFromFireStore
                }
            }
            return profile
        }
        const profileFromFireStore = await fetchUser(user_id)
        if(profileFromFireStore){
            await UserDataGW.save(profileFromFireStore)
        }
        return profileFromFireStore
    }

    static normalize=async(user_id:string)=>{
        const profile = await UserDataGW.get(user_id)
        if(profile){
            if(!profile.studentNum){
                const profileFromFireStore = await fetchUser(user_id)
                if(profileFromFireStore && profileFromFireStore.studentNum){
                    await UserDataGW.save(profileFromFireStore)
                    return profileFromFireStore
                }
            }
        }else{
            const profileFromFireStore = await fetchUser(user_id)
            if(profileFromFireStore){
                await UserDataGW.save(profileFromFireStore)
            }
        }
    }
}
