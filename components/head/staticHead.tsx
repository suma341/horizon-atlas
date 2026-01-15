import Head from "next/head"

const StaticHead=()=>{
    return (
        <Head>
            <title>【 HorizonAtlas 】RyukokuHorizon部員専用プログラミング学習サイト</title>
            <meta property="og:title" content="HorizonAtlas" />
            <meta name="description" content="HorizonAtlasは、RyukokuHorizonの学習カリキュラムをまとめた部員専用のサービスです。" />
            <meta name="keywords" content="ryukoku,龍谷,プログラミング部,Horizon,HorizonAtlas" />
            <meta property="og:description" content="HorizonAtlasは、RyukokuHorizonの学習カリキュラムをまとめた部員専用のサービスです。" />
            <meta property="og:image" content={`/horizon-atlas/app_image.png`} />
            <meta property="og:type" content="website" />
            <meta name='twitter:title' content="HorizonAtlas" />
            <meta name='twitter:description' content="HorizonAtlasは、RyukokuHorizonの学習カリキュラムをまとめた部員専用のサービスです。" />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name="twitter:card" content={`/horizon-atlas/app_image.png`} />
            <link rel="icon" href="/horizon-atlas/favicon.ico" />
        </Head>
    )
}

export default StaticHead;