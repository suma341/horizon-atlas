import Tags from "@/components/tag/Tags";
import { getAllTags } from "@/lib/services/notionApiService";
import { GetStaticProps } from "next";
import { FaSearch } from "react-icons/fa";

type allTags = {
    allTags:string[]
}

export const getStaticProps: GetStaticProps = async () => {
    const allTags:string[] = await getAllTags();
    return {
      props: {
        allTags
      },
      revalidate: 50, // 50秒間隔でISRを実行
    };
  };

export default function SearchPage({allTags}:allTags) {

  return (
    <>
      <div className="container h-full w-full mx-auto">
        <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Horizon TechShelf</h1>
        <div>
          <div className="my-10 mx-5">
              <p>キーワード検索</p>
              <div className="flex bg-white p-1 rounded-md">
                  <FaSearch
                      className="ml-1.5 mt-0.5 text-gray-500"
                      size={25}/>
                  <input
                      type="text"
                      className="rounded mx-5 w-10/12 bg-slate-50 p-1 focus:outline-none focus:bg-slate-100 duration-200"
                      placeholder="Search..."/>
                  <button className="bg-slate-900 text-white w-2/12 rounded-md p-1">検索</button>
              </div>
          </div>
          <div>
              <Tags allTags={allTags} />
          </div>
        </div>
        </main>
      </div>
    </>
  );
}
