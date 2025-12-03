import AnswerGW from "../Gateways/answerGW"

export default class AnswerSvc{
    static getAll=async()=>{
        const data = await AnswerGW.get()
        return data
    }

    static getById=async(id:string)=>{
        const data = await AnswerGW.get({id})
        if(data[0]) return data[0]
        return null
    }

    static getByPageId=async(pageId:string)=>{
        const page = await AnswerGW.get({id:pageId})
        if(page[0]) return page[0]
        return null
    }
}