"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type Props = {
  course: string;
  icon: {
    url: string | undefined;
    type: string | undefined;
  };
};

const SingleCourse = ({ course, icon }: Props) => {
  return (
    <Link href={`/posts/course/${course}`} className="group">
      <section className="translate-y-5 animate-fadeIn mb-4 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-gray-200/70 bg-white/90 hover:bg-gray-100/50 backdrop-blur-xl transform group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1">
        <div className="flex items-center">
          {icon.type === "" && (
            <Image
              src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"}
              alt={course}
              width={40}
              height={40}
              className="w-12 h-12 mr-4 transition-transform duration-500 ease-out group-hover:rotate-12"
            />
          )}
          {icon.type !== "emoji" && icon.type !== "" && (
            <Image
              src={icon.url ?? "https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"}
              alt={course}
              width={40}
              height={40}
              className="w-12 h-12 mr-4 transition-transform duration-500 ease-out group-hover:rotate-12"
            />
          )}
          {icon.type === "emoji" && (
            <p className="text-4xl mr-4 transition-transform duration-500 ease-out group-hover:rotate-12">
              {icon.url}
            </p>
          )}
          <h2 className="text-lg sm:text-xl font-semibold line-clamp-1 text-gray-800 group-hover:text-indigo-500 transition-colors duration-300">
            {course}
          </h2>
        </div>
      </section>
    </Link>
  );
};

export default SingleCourse;
