import SingleCourse from "@/components/Post/SingleCourse";
import { getEitherCourses } from "@/lib/services/notionApiService";
import { GetStaticProps } from "next";

type Props = {
  courses:string[]
};

export const getStaticProps: GetStaticProps = async () => {
  const notBasicCourses = await getEitherCourses(false);
  const removeEmptyCourses = notBasicCourses.filter((course)=>course!=="")
    return {
        props: {
          courses:removeEmptyCourses
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const PostsPage = ({ courses }: Props)=> {
    return (
      <div className="container h-full w-full mx-auto font-mono">
        <main className="container w-full mt-16 mb-3">
          <h1 className="text-5xl font-medium text-center mb-16">Horizon TechShelf</h1>
          <section className="sm:grid grid-cols-2 gap-3 mx-auto">
            <SingleCourse course="基礎班カリキュラム" />
            {courses.map((course)=>{
              return <SingleCourse course={course} />
            })}
          </section>
        </main>
      </div>
      
    );
  }

  export default  PostsPage;