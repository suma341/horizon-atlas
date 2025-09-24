import InfoGW from "../Gateways/InfoGW"

export default class InfoSvc{
    static getAll=async()=>{
        const data = await InfoGW.get()
        return data
    }

    static getById=async(id:string)=>{
        const data = await InfoGW.get({id})
        if(data[0]) return data[0]
        return null
    }

    static getByPageId=async(pageId:string)=>{
        const page = await InfoGW.get({id:pageId})
        if(page[0]) return page[0]
        return null
    }
}