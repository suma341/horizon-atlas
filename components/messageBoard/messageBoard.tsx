import Link from "next/link";

type Props={
    title:string;
    message:string;
    link:string;
    linkLabel:string;
}

const MessageBoard=({title,message,link,linkLabel}:Props)=>{
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-white bg-purple-950 border border-purple-700 shadow-2xl rounded-2xl">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="mb-6 text-sm text-purple-200">
              {message}
            </p>
            <Link href={link} className="inline-block">
              <div className="bg-purple-700 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                {linkLabel}
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
}

export default MessageBoard;