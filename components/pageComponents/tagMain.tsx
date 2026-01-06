import { Profile } from "@/types/profile"
import Loader from "../loader/loader"
import Pagenation from "../pagenation/Pagenation"
import SinglePost from "../Post/SinglePost"
import Tags from "../tag/Tags"
import { useEffect, useState } from "react"
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage"
import { calculatePageNumber, getPostsByRole } from "@/lib/services/notionApiService"
import { PageInfo } from "@/types/page"

type Props={
    userProfile:Profile | null
    allTags:string[]
    currentTag:string
    posts:PageInfo[]
}

export const TagMain=({userProfile,allTags,currentTag,posts}:Props)=>{
    const [currentPage, setCurrentPage] = useState(1);
    const [matchPosts, setMatchPosts] = useState<PageInfo[]>(posts);
    const numberOfPages = calculatePageNumber(posts);
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
                const postsByRole = await getPostsByRole(usersRole,posts);
                setMatchPosts(postsByRole);
            }finally{
                setLoading(false)
            }
        }
        setData();
      },[posts,userProfile,currentTag])

    return (
        <div className="h-full w-full mx-auto font-mono">
            <main className="mt-20 mx-5 md:mx-16 mb-3 pt-4">
                <Tags allTags={allTags} />
                {!loading && <section className="pt-5">
                    {matchPosts.slice(NUMBER_OF_POSTS_PER_PAGE * (currentPage - 1), NUMBER_OF_POSTS_PER_PAGE * currentPage).map((post)=>{
                        return (
                            <div key={post.curriculumId}>
                                <SinglePost
                                    postData={{...post,id:post.curriculumId}}
                                />
                            </div>
                    )})}
                </section>}
                {loading && <Loader size={20} />}
            </main>
            <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} setPage={setCurrentPage} />
        </div>
    )
}