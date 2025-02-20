import Link from 'next/link';
import {IoIosSearch} from 'react-icons/io'

function SearchIcon() {

    return (
        <Link href={'/search'}>
            <div className="ml-2 p-2 bg-slate-500 text-white inline-flex items-center justify-center rounded-full hover:bg-blue-500 transition-all duration-300">
                <IoIosSearch size={22} />
            </div>
        </Link>
    )
}

export default SearchIcon;