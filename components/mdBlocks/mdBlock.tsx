"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from './paragraph/paragraph';
import Heading1 from './Heading1/Heading1';
import Heading2 from './Heading2/Heading2';
import Heading3 from './Heading3/Heading3';
import Divider from './divider/divider';
import Code from './code/Code';
import NumberedListItem from './numbered_list_item/numbered_list_item';
import BulletedListItem from './bulleted_list_ite/bulleted_list_item';
import Callout from './callout/callout';
import Quote from './quote/quote';
import ImageBlock from './image/image';
import TableBlock from './table/table';
import ChildPage from './child_page/child_page';
import Bookmark from './bookmark/bookmark';
import ToggleBlock from './toggle/toggle';
import EmbedBlock from './embed/embed';
import Link_to_page from './link_to_page/link_to_page';
import Table_of_contents from './table_of_contents/table_of_contents';

type Props ={
    mdBlock:MdBlock;
    depth:number;
    slug:string;
    page?:MdBlock[];
}

export default function MdBlockComponent(props:Props) {
    const {mdBlock,depth,slug,page} = props;
    if(mdBlock.type==='paragraph'){
      return <Paragraph parent={mdBlock.parent} slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='heading_1'){
        return <Heading1 mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type === 'heading_2'){
        return <Heading2 mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='heading_3'){
        return <Heading3 mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='divider'){
        return <Divider mdBlock={mdBlock} />
    }else if(mdBlock.type === 'code'){
        return <Code mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='numbered_list_item'){
        return <NumberedListItem slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='bulleted_list_item'){
        return <BulletedListItem slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='callout'){
        return <Callout slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type === 'quote'){
        return <Quote slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type === 'image'){
        return <ImageBlock mdBlock={mdBlock} depth={depth} slug={slug} />
    }else if(mdBlock.type==='table'){
        return <TableBlock slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type==='child_page'){
        return <ChildPage mdBlock={mdBlock} />
    }else if(mdBlock.type === 'bookmark'){
        return <Bookmark slug={slug}  mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type === 'toggle'){
        return <ToggleBlock slug={slug} mdBlock={mdBlock} depth={depth} />
    }else if(mdBlock.type === 'embed'){
        return <EmbedBlock mdBlock={mdBlock} depth={depth} slug={slug} />
    }else if(mdBlock.type==='link_to_page'){
        return <Link_to_page mdBlock={mdBlock} />
    }else if(mdBlock.type==='table_of_contents'){
        return <Table_of_contents mdBlock={mdBlock} page={page} />
    }
    return (
        <>
          <div></div>
        </>
    )
}

