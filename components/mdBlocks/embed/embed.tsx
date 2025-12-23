import Loader from '@/components/loader/loader';
import { MdBlock } from '@/types/MdBlock';
import React,{ useEffect, useState,useRef } from 'react'

type Props = {
    mdBlock: MdBlock;
    depth: number;
};
function EmbedBlock(props: Props) {
    try{
        const {mdBlock} = props;
    const [appHeight,setAppHeight] = useState("500px");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const data = mdBlock.parent.embed;
    const [sLoad,setSLoad] = useState(false)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.height) {
                setAppHeight(`${event.data.height}px`);
            }
        };
        try{
            setSLoad(true)
            window.addEventListener("message", handleMessage);
            return () => window.removeEventListener("message", handleMessage);
        }finally{
            setSLoad(false)
        }
    }, []);

      if(!data)return;

    return (<div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} className='mx-1.5 my-1.5' id={mdBlock.blockId}>
        {sLoad && <Loader size={60} />}
        {!sLoad && <>
            {data.canEmbed && <iframe src={data.url} ref={iframeRef}
            style={{
                width: "100%",
                height: appHeight,
                border: "none",
                overflow: "hidden"
                }}
            allowFullScreen />}
        </>}
    </div>)
    }catch(e){
        throw new Error(`error in embed error: ${e}`)
    }
}
export default EmbedBlock;