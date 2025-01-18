import React, { Dispatch, SetStateAction } from 'react'

type Props ={
  setOpenSide: Dispatch<SetStateAction<boolean>>;
}

function HamburgerButton({setOpenSide}:Props) {
  return (
    <button onClick={()=>setOpenSide(true)} className="flex flex-col gap-1 w-5 h-6">
        <span className="border border-neutral-400 w-5"></span>
        <span className="border border-neutral-400 w-5"></span>
        <span className="border border-neutral-400 w-5"></span>
    </button>
  )
}

export default HamburgerButton;