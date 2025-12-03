export function typeAssertio<T>(data:Record<string,string | number | boolean>,type:string):T{
    try{
        return data as T
    }catch(e){
        throw new Error(`error in typeAssertio:${type}\n error:${e}`)
    }
}
