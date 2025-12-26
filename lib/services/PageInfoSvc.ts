import PageInfoGW from "../Gateways/PageInfoGW"

export default class PageInfoSvc{
    static getAll=async()=>{
        const pages = await PageInfoGW.get()
        return pages
    }

    static getByCurriculum=async(curriculumId:string)=>{
        const pages = await PageInfoGW.get({curriculumId})
        return pages;
    }

    static getByPageId=async(pageId:string)=>{
        const page = await PageInfoGW.get({id:pageId})
        if(page[0]) return page[0]
        return null
    }

    static getBaseCurriculum=async()=>{
        const pages = await PageInfoGW.get()
        const bp = pages.filter((p)=>p.curriculumId===p.id)
        return bp
    }

    static getCurriculumByCategory=async(category:string)=>{
        const pages = await PageInfoGW.get()
        const bp = pages.filter((p)=>p.curriculumId===p.id)
        const target = bp.filter((d)=>{
            if(category==="") return d.category.length<=0
            return d.category.find((cat)=>cat===category)
        })
        return target.sort((a,b)=>a.order -b.order);
    }
}