export type Icon={
    type:string;
    emoji:string | undefined;
    file:{
        url:string;
        expiry_time:string;
    } | undefined;
    external:{
        url:string;
    } | undefined;
} | null;