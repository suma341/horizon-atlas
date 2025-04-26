export type TableCell={
    "type":string;
    "text":{
        "content":string;
        "link":string | null;
    };
    "annotations":{
        "bold":boolean;
        "italic":boolean;
        "strikethrough":boolean;
        "underline":boolean;
        "code":boolean;
        "color":string;
    };
    "plain_text":string;
    "href":string | null;
}