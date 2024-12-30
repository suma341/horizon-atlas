import SingleCourse from "@/components/Post/SingleCourse";
import {  getEitherCourses } from "@/lib/services/notionApiService";
import type { GetStaticProps,} from "next";

type Props={
    basicCourse:string[]
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const basicCourse = await getEitherCourses(true);

    return {
        props: {
            basicCourse
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const blogTagPageList = ({basicCourse }: Props)=> {
    return (
        <div className="container h-full w-full mx-auto font-mono">
        <main className="container w-full mt-16 mb-3">
            <h1 className="text-5xl font-medium text-center mb-16">Horizon</h1>
            <section className="sm:grid grid-cols-2 gap-3 mx-auto">
                {basicCourse.map((course,i)=>
                    <SingleCourse course={course} key={i} />
                )}
            </section>
        </main>
        </div>
        
    );
}

export default blogTagPageList;