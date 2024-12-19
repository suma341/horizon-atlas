import React from 'react';

export type MdTypeAndText = {
    type:"bold" | "italic" | "code" | "underline" | "link" | "normal"
    text:string
    style?: React.CSSProperties | undefined
    link?:string
  }
  