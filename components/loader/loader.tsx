import { Loader2 } from "lucide-react"

type Props={
    size:number;
}

const Loader=({size}:Props)=>{
    return (
        <div className="flex flex-col items-center flex-1 justify-center">
            <Loader2 className="animate-spin text-purple-400" size={size} />
        </div>
    )
}

export default Loader;