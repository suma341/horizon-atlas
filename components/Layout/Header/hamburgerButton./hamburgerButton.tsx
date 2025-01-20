import React, { Dispatch, SetStateAction } from 'react'

type Props ={
  openSide:boolean;
  setOpenSide: Dispatch<SetStateAction<boolean>>;
}

function HamburgerButton({setOpenSide,openSide}:Props) {
  return (
    <button onClick={()=>setOpenSide(!openSide)} className="flex flex-col gap-1 w-6 h-6">
        <span className="border border-neutral-400 w-6"></span>
        <span className="border border-neutral-400 w-6"></span>
        <span className="border border-neutral-400 w-6"></span>
    </button>
  )
}

export default HamburgerButton;