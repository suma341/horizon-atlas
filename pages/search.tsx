import Navbar from "@/components/Navbar/navbar";
import SinglePost from "@/components/Post/SinglePost";
import SearchForm from "@/components/searchForm/searchForm";
import Tags from "@/components/tag/Tags";
import { HOME_NAV, SEARCH_NAV } from "@/constants/pageNavs";
import { searchByKeyWord } from "@/lib/searchKeyWord";
import { getAllTags } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetServerSideProps } from "next";

type Props = {
  allTags:string[];
  query:string[] | null;
  posts:PostMetaData[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allTags:string[] = await getAllTags();
  const q = context.query.q===undefined ? null : (context.query.q as string[]);
  const result = q !== null ? await searchByKeyWord(q) : [] as PostMetaData[]; 
  return {
    props:{
      query:q,
      allTags,
      posts:result
    }
  }
}

export default function SearchPage({allTags, query,posts}:Props) {
  return (
    <>
      <Navbar pageNavs={[HOME_NAV,SEARCH_NAV]} />
      <div className="h-full w-full mx-auto">
        <main className="w-full mt-16 px-8 sm:px-28 lg:px-44">
          <div>
            <SearchForm />
            {query===null && <Tags allTags={allTags} />}
            {query!==null && posts.length!==0 && posts.map((post,i)=>
              <SinglePost postData={post} isPagenationPage={false} key={i} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
