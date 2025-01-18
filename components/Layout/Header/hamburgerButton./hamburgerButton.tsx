import React from 'react'

function HamburgerButton() {
  return (
    <button className="flex flex-col gap-1 w-5 h-6">
        <span className="border border-neutral-400 w-5"></span>
        <span className="border border-neutral-400 w-5"></span>
        <span className="border border-neutral-400 w-5"></span>
    </button>
  )
}

export default HamburgerButton;