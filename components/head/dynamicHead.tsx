import Head from "next/head"

type Props={
    title:string;
    firstText:string;
    image:string;
    link:string;
}

const DynamicHead=({title,firstText,image,link}:Props)=>{
    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/horizon-atlas/favicon.ico" />
            <meta name='description' content='HorizonAtlasは、学習カリキュラムをまとめたHorizon部員専用のサービスです。' />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={firstText} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={link} />
            <meta property='og:type' content='website' />
            <meta property='og:site_name' content="HorizonAtlas" />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={firstText} />
            <meta name='twitter:image' content={image} />
        </Head>
    )
}

export default DynamicHead;