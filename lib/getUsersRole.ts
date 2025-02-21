import { CustomUser } from "@/global";
import { RoleData } from "@/types/role";

export function getUsersRole(user:CustomUser,roleData:RoleData){
    const usersRoleId = user.given_name;
    const isDeveloper = usersRoleId?.some(item=>item===roleData.develop.id);
    if(isDeveloper){
        return "発展班";
    }
    const isBasic = usersRoleId?.some(item=>item===roleData.basic.id);
    if(isBasic){
        return "基礎班";
    }
    return "体験入部";
}