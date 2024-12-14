import { getNumberOfPages, getPostsByPage,getAllTags } from "@/lib/notionAPI";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";

type pagePath = {
    params: { page:string }
  }

export const getStaticPaths:GetStaticPaths = async() =>{
    const numberOfPages:number =await getNumberOfPages();
    const paramsList:pagePath[] = [];
    for(let i:number=0;i<numberOfPages;i++){
        paramsList.push({ params:{ page:i.toString() } })
    }
    return {
        paths:paramsList,
        fallback:'blocking'
    }
  }

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const currentPage:string = typeof context.params?.page == 'string' ? context.params.page : '1';
    const numberOfPages:number =await getNumberOfPages();
    const allTags = await getAllTags();

    const postsByPage = await getPostsByPage(parseInt(currentPage));
    return {
        props: {
          postsByPage,
          numberOfPages,
          currentPage,
          allTags
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

// Homeコンポーネント
const blogPageList = ({ postsByPage,numberOfPages,currentPage,allTags }: InferGetStaticPropsType<typeof getStaticProps>)=> {
  return (
    <div className="container h-full w-full mx-auto font-mono">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Horizon TechShelf</h1>
        <section className="sm:grid grid-cols-2 gap-3 mx-auto">
          {postsByPage.map((post:PostMetaData,i:number)=>(
          <div key={i}>
              <SinglePost
              id={post.id}
              title={post.title} 
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
              isPagenationPage={true}
              />
          </div>
          ))}
        </section>
      </main>
      <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} tag={""} />
    </div>
    
  );
}

export default blogPageList;