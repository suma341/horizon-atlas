export const getPageLink=(page:number,tag?:string, course?:string)=>{
    if(tag!==undefined){
        return `/posts/tag/${tag}/page/${page}`;
    }else if(course!=undefined){
        return `/posts/${course}/${page}`;
    }
    return `/posts/page/${page}`;
}