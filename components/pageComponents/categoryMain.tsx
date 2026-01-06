import Image from "next/image"
import SinglePost from "../Post/SinglePost"
import Loader from "../loader/loader"
import { useEffect, useState } from "react";
import { getPostsByRole } from "@/lib/services/notionApiService";
import { PageInfo } from "@/types/page";
import { Category } from "@/types/category";
import { Profile } from "@/types/profile";

type Props={
    userProfile:Profile | null
    posts:PageInfo[]
    category: Category
}

export const CategoryMain=({userProfile,posts,category}:Props)=>{
    const [postsByRole, setPostsByRole] = useState(posts);
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
                const postsByRole = await getPostsByRole(usersRole,posts);
                setPostsByRole(postsByRole);
            }finally{
                setLoading(false)
            }
        }
        setData()
    },[posts,userProfile])

    return (
        <div className='pt-20 min-h-screen md:flex md:flex-col md:items-center '>
            {category.coverUrl !=="" && <Image src={category.coverUrl} alt={''} width={120} height={120} className='h-56 top-0' style={{width:"100vw"}} />}
            <section className='bg-white pb-10 md:max-w-4xl px-2 md:min-w-[670px]' style={(category.coverUrl !=="") ? {} : {paddingTop:"4rem"}}>
                {category.iconType ==="" && <Image src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={category.coverUrl !=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                {category.iconType !== "emoji" && category.iconType!=="" && <Image src={category.iconUrl} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={category.coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                {category.iconType === "emoji" && <p className='relative w-14 h-14 text-7xl' style={category.coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}}>{category.iconUrl}</p>}
                <h2 className='w-full text-3xl font-bold'>{category.title}</h2>
                <div className="mt-8">
                    <p>{category.description}</p>
                </div>
                {!loading && <div className="mt-8">
                    {postsByRole.map((post)=>{
                        return (
                            <div key={post.curriculumId}>
                                <SinglePost
                                postData={{...post,id:post.curriculumId}}
                                category={category.title}
                                />
                            </div>
                        )
                    })}
                </div>}
                {loading && <Loader size={20} />}
            </section>
        </div>
    )
}