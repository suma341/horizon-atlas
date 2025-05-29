export const replaceIconUrl=(iconUrl,iconType)=>{
    if(iconType==="file"){
        iconUrl = iconUrl.replace("/horizon-atlas","../public")
    }
    return {iconUrl,iconType}
}