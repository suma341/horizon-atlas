import Loader from '@/components/loader/loader';
import { Parent } from '@/types/Parent';import { Loader2 } from 'lucide-react';
import { MdBlock } from 'notion-to-md/build/types';
import React,{ useEffect, useState,useRef } from 'react'

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

type IframeData={
    title:string;
    html:string;
}

type EmbedData ={
    parent:Parent[];
    url:string;
    downloadUrl:string;
}

function EmbedBlock(props: Props) {
    const {mdBlock} = props;
    const [html,setHtml] = useState("");
    const [title,setTitle] = useState("");
    const [appHeight,setAppHeight] = useState("500px");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const data:EmbedData = JSON.parse(mdBlock.parent)
    const [load, setLoad] = useState(false)

    useEffect(()=>{
        async function fetchIframeData(){
            setLoad(true);
            try{
                const res = await fetch(data.downloadUrl);
                const iframeData:IframeData = await res.json();
                setHtml(iframeData.html);
                setTitle(iframeData.title);
            }finally{
                setLoad(false);
            }
        }
        fetchIframeData();
    },[mdBlock.blockId])

    useEffect(() => {
        if(title==="Flet"){
            const handleMessage = (event: MessageEvent) => {
            if (event.origin === "https://flet-samples.fly.dev" && event.data?.height) {
                setAppHeight(`${event.data.height}px`);
            }
            };
            window.addEventListener("message", handleMessage);
            return () => window.removeEventListener("message", handleMessage);
        }
      }, [title]);

    return (<div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} className='mx-1.5 my-1.5' id={mdBlock.blockId}>
        {load && <Loader size={60} />}
        {!load && <>
            {title==="Flet" && <iframe src={data.url} ref={iframeRef}
            style={{
                width: "100%",
                height: appHeight,
                border: "none",
                overflow: "hidden"
                }}
            allowFullScreen />}
            {title!=="Flet" && <div
                dangerouslySetInnerHTML={{ __html: html }}
            />}
        </>}
    </div>)
}

function LoadingScreen() {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-purple-400" size={48} />
      </div>
    );
  }

export default EmbedBlock;