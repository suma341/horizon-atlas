import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";
import {  getAllTags, getEitherCourses, getPostsByCourse, getPostsByRole } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetStaticProps } from "next";
import SearchField from "@/components/SearchField/SearchField";
import Tags from "@/components/tag/Tags";
import { CurriculumService } from "@/lib/services/CurriculumService";
import Link from "next/link";
import { BsCompass } from "react-icons/bs";
import SingleCourse from "@/components/Post/SingleCourse";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import SinglePost from "@/components/Post/SinglePost";
import { useEffect, useState } from "react";
import useUserProfileStore from "@/stores/userProfile";
import Loader from "@/components/loader/loader";

type Props = {
  courseAndPosts:{
    course: string;
    posts:PostMetaData[];
  }[];
  allTags:string[];
  targetCategory:Category[];
  emptyCoursesPosts:PostMetaData[];
};

export const getStaticProps: GetStaticProps = async () => {
  const allPosts:PostMetaData[] = await CurriculumService.getAllCurriculum();
  const notBasicCourses = await getEitherCourses(false,allPosts);
  const removeEmptyCourses = notBasicCourses.filter((course)=>course!=="")
  const emptyCourses = notBasicCourses.filter((course)=>course==="")
  const courseAndPosts = await Promise.all(removeEmptyCourses.map(async(course)=>{
    const posts = await getPostsByCourse(course,allPosts);
    return {
        course,
        posts
    }
  }))
  const emptyCoursesPosts = await Promise.all(emptyCourses.map((async(course)=>{
    const posts = await getPostsByCourse(course,allPosts);
    return posts
  })));
  const allTags = await getAllTags(allPosts);
  const allCategory = await CategoryService.getAllCategory()
  const targetCategory = allCategory.filter((item)=>{
    return notBasicCourses.some((item2)=>item2===item.title)
})
  return {
      props: {
        courseAndPosts,
        allTags,
        targetCategory,
        emptyCoursesPosts:emptyCoursesPosts.flat()
      },
  };
};

const PostsPage = ({ allTags,courseAndPosts,targetCategory,emptyCoursesPosts}: Props)=> {
  const [postsByRole, setPostsByRole] = useState(emptyCoursesPosts);
  const { userProfile } = useUserProfileStore();
  const [courseByRole,setCourseByRole] = useState<{
    course: string;
    posts: PostMetaData[];
  }[]>(courseAndPosts)
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
      async function setData(){
        try{
          setLoading(true)
          const usersRole = userProfile?.given_name ?? "体験入部"
          const postsByRole = await getPostsByRole(usersRole,emptyCoursesPosts);
          setPostsByRole(postsByRole);
          const courseByRole = await Promise.all(courseAndPosts.map(async(item)=>{
            const coursePostsByRole = await getPostsByCourse(usersRole,item.posts)
            return {posts:coursePostsByRole,course:item.course};
          }))
          setCourseByRole(courseByRole)
        }finally{
          setLoading(false)
        }
      }
      setData()
  },[emptyCoursesPosts,userProfile])

    return (
      <Layout pageNavs={[HOME_NAV]}>  
        <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen">
          <div className="container max-w-3xl mx-auto font-sans pt-24 px-6">
            <main className="mt-16 mb-5 flex flex-col gap-8">

              <section className="mb-12">
                <Link href={`/posts/course/basic`} className="block group">
                  <section className="relative bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:-translate-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-extrabold tracking-wide text-gray-900 group-hover:text-purple-700 transition-colors duration-100">
                        基礎班カリキュラム
                      </h2>
                      <BsCompass className="text-6xl text-purple-600 hover:text-purple-700 transition-all duration-300 group-hover:rotate-[660deg] group-hover:scale-[1.03]" />
                    </div>
                    <p className="text-lg text-gray-600/90 mt-3 leading-relaxed">
                      PythonやFletライブラリを通してアプリ開発を学べるカリキュラムです。初心者向けに丁寧に解説します！
                    </p>
                  </section>
                </Link>
              </section>

              <SearchField searchKeyWord={""} />
              <Tags allTags={allTags} />
              {!loading && courseByRole.length!==0 && <div>
                {courseByRole.map((item,i)=>{
                  if(item.posts.length!==0){
                    const target = targetCategory.find(
                      (item1) => item1.title === item.course
                    );
                    return (
                      <SingleCourse key={i} course={item.course} icon={{url:target?.iconUrl,type:target?.iconType}} />
                    )
                  }
                })}
              </div>}
              {!loading && postsByRole.length!==0 && <div className="mt-5">
                <p className="font-bold m-2">その他の資料</p>
                {postsByRole.map((item)=>(
                  <SinglePost postData={item} key={item.curriculumId} />
                ))}
              </div>}
              {loading && <Loader size={20} />}
            </main>
          </div>
        </div>
      </Layout>

    );
  }

  export default  PostsPage;