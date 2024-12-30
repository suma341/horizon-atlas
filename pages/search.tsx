import SearchForm from "@/components/searchForm/searchForm";
import Tags from "@/components/tag/Tags";
import { getAllTags } from "@/lib/services/notionApiService";
import { GetStaticProps } from "next";
import { useRouter } from 'next/router';

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

  const router = useRouter();
  const { q } = router.query;

  return (
    <>
      <div className="container h-full w-full mx-auto">
        <main className="container w-full mt-16">
          <div>
            <SearchForm />
            {q===undefined && <Tags allTags={allTags} />}
          </div>
        </main>
      </div>
    </>
  );
}
