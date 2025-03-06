import useCurriculumIdStore from '@/stores/curriculumIdStore';
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

function EmbedBlock(props: Props) {
    const {mdBlock} = props;
    const match = mdBlock.parent.match(/\((.*?)\)/g);
    const [html,setHtml] = useState("");
    const [title,setTitle] = useState("");
    const [appHeight,setAppHeight] = useState("500px");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { curriculumId } = useCurriculumIdStore()

    useEffect(()=>{
        async function fetchIframeData(){
            const res = await fetch(`/horizon-atlas/notion_data/eachPage/${curriculumId}/iframeData/${mdBlock.blockId}.json`);
            const iframeData:IframeData = await res.json();
            setHtml(iframeData.html);
            setTitle(iframeData.title);
        }
        fetchIframeData();
    },[mdBlock.blockId])

    useEffect(() => {
        if(match && title==="Flet"){
            const handleMessage = (event: MessageEvent) => {
            if (event.origin === "https://flet-samples.fly.dev" && event.data?.height) {
                setAppHeight(`${event.data.height}px`);
            }
            };
            window.addEventListener("message", handleMessage);
            return () => window.removeEventListener("message", handleMessage);
        }
      }, [title]);

    if(match && title==="Flet"){
        const url = match[0].slice(1, -1);
        return (<div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} className='mx-1.5 my-1.5' id={mdBlock.blockId}>
            <iframe src={url} ref={iframeRef}
            style={{
                width: "100%",
                height: appHeight,
                border: "none",
                overflow: "hidden"
              }}
              allowFullScreen />
        </div>)
    }
        console.log("html",html)
        return (
            <div className='mx-1.5 my-1.5' id={mdBlock.blockId}>
                <div
                dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        )
    // }
}

export default EmbedBlock;