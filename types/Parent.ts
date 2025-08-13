export type Parent={
    annotations:{
        bold:boolean;
        italic:boolean;
        strikethrough:boolean;
        underline:boolean;
        code:boolean;
        color:string;
    };
    plain_text:string;
    href:string | null;
    scroll:string | undefined;
    mention?:LinkMntion | PageMention | PageMentionProcessed
};

type LinkMntion={
    type:"link_mention"
    content:{
        href:string,
        title:string,
        icon_url?:string,
        description:string,
        link_provider:string, //作者
        thumbnail_url:string
    }
}

type PageMention={
    type:"page",
    content:{
        id:string
    }
}

type PageMentionProcessed={
    type:"prossedPage",
    content:{
        iconUrl:string;
        iconType:string;
        title:string;
    }
}