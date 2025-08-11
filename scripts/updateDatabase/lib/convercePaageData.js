export const converce=async(re)=>{
    return await Promise.all(re.map(async(item)=>{
        const curriculumId = item.id
        const pr = item.properties;
        const tag = pr.tag.multi_select.map((t)=>t.name) ?? []
        const visibility = pr.visibility.multi_select.map((v)=>v.name) ?? []
        const is_basic_curriculum = pr.is_basic_curriculum.checkbox
        const title = pr.title.title[0].text.content
        const order = pr.order.number
        const category = pr.category.select?.name ?? ""
        const {coverUrl} = await getCover(curriculumId,curriculumId,item.cover)
        const {iconType,iconUrl} = await getIcon(curriculumId,curriculumId,item.icon)
        return {
            curriculumId,
            tag,
            visibility,
            is_basic_curriculum,
            title,
            iconType,
            order,
            category,
            iconUrl,
            coverUrl
        }
    }))
}

const getCover=async(curriculumId,pageId,cover)=>{
    let coverUrl = "";
    if(cover){
        if(cover.type==="file"){
            let exte = cover.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg")){
                exte = "png";
            }
            // await downloadImage(cover.file.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/cover/${pageId}.${exte}`)
            coverUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/cover/${pageId}.${exte}`
            return {coverUrl}
        }else if(cover.type==="external"){
            coverUrl = cover.external.url
            return {coverUrl}
        }else if(cover.type==="emoji"){
            coverUrl = cover.emoji
            return {coverUrl}
        }
    }
    return {coverUrl}
}

const getIcon=async(curriculumId,pageId,icon)=>{
    let iconType = "";
    let iconUrl = "";
    if(icon){
        iconType = icon.type;
        if(iconType==="file"){
            let exte = icon.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg"  && exte!="svg")){
                exte = "png";
            }
            // await downloadImage(icon.file.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`)
            iconUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`
            return {iconType,iconUrl}
        }else if(iconType==="external"){
            iconUrl = icon.external.url
            return {iconType,iconUrl}
        }else if(iconType==="emoji"){
            iconUrl = icon.emoji
            return {iconType,iconUrl}
        }else if(iconType==="custom_emoji"){
            let exte = icon.custom_emoji.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg"  && exte!="svg")){
                exte = "png";
            }
            // await downloadImage(icon.custom_emoji.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`)
            iconUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`
            return {iconType,iconUrl}
        }
    }
    return {iconType,iconUrl}
}