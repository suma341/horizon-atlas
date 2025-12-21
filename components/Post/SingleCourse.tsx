"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category";

type Props = {
  category:Category
};

const SingleCourse = ({ category }: Props) => {
  return (
    <Link href={`/posts/course/${category.id}`} className="group">
      <section className="translate-y-5 animate-fadeIn mb-4 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-gray-200/70 bg-white/90 hover:bg-gray-100/50 backdrop-blur-xl transform group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1">
        <div className="flex flex-row items-center justify-start">
          {(category.iconType === "" || category.iconUrl==="") && 
            <Image
              src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"}
              alt={category.title}
              className="w-12 h-12 m-0 mr-4 duration-500 ease-out group-hover:rotate-12"
            />
          }
          {category.iconType !== "emoji" && category.iconType !== "" && category.iconUrl!=="" && (
            <Image
              src={category.iconUrl}
              alt={category.title}
              className="w-12 h-12 m-0 mr-4 duration-500 ease-out group-hover:rotate-12"
            />
          )}
          {category.iconType === "emoji" && (
            <p className="text-4xl mr-4 transition-transform duration-500 ease-out group-hover:rotate-12">
              {category.iconUrl}
            </p>
          )}
          <h2 className="text-lg sm:text-xl font-semibold line-clamp-1 text-gray-800 group-hover:text-indigo-500 transition-colors duration-300">
            {category.title}
          </h2>
        </div>
      </section>
    </Link>
  );
};

export default SingleCourse;
