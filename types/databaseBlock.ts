type SelectType = {
    "id": string,
    "name": string,
    "color": string
}

type DateType={
    "start": string,
    "end": null | string,
    "time_zone": null | string
}

type RichText={
    "type": string,
    "text": {
        "content": string,
        "link": null | string
    },
    "annotations": {
    "bold": boolean,
    "italic": boolean,
    "strikethrough": boolean,
    "underline": boolean,
    "code": boolean,
    "color": string
    },
    "plain_text": string,
    "href": null | string
}[]

type TitleType=RichText

type PeopleType={
    "object": string,
    "id": string,
    "name": string,
    "avatar_url":string,
    "type": string,
    "person": {
        "email": string
    }
}[]

export type DatabaseBlock={
    database_data:{
        title:{
            "type": string,
            "text": {
              "content": string,
              "link": null | string
            },
            "annotations": {
              "bold": boolean,
              "italic": boolean,
              "strikethrough": boolean,
              "underline": boolean,
              "code": boolean,
              "color": string
            },
            "plain_text": string,
            "href": null | string
        }[],
        properties:Record<string,object>,
        is_inline:boolean
    },
    query_data:{
        id:string,
        properties:{
            [x:string]:{
                "id": string,
                "type":"rich_text",
                "rich_text":RichText
            }
        } | {
            [x:string]:{
                "id": string,
                "type":"date",
                "date":DateType
            }
        } | {
                [x:string]:{
                    "id": string,
                    "type":"select",
                    "select":SelectType
                }
        } | {
            [x:string]:{
                "id": string,
                "type":"people",
                "people":PeopleType
            }
        } | {
            [x:string]:{
                "id": string,
                "type":"title",
                "title":TitleType
            }
        }
    }[]
}