type Props={
    setOpenbar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidePeak = ({setOpenbar}:Props) => {
    return (
        <button
            onClick={() => {setOpenbar(true)}}
            aria-label="Open sidebar"
            className="hidden md:flex items-center justify-center fixed right-0 top-[5.5rem] h-14 w-6 bg-white border border-neutral-300 rounded-l-md shadow-md transition hover:bg-neutral-100 hover:shadow-lg cursor-pointer"
        >
            <span className="text-neutral-500 transition-transform hover:scale-110">＜</span>
        </button>
    );
};

export default SidePeak;