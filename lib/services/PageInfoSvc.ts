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
}