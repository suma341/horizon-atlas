import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PiSignOut } from "react-icons/pi";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import useUserProfileStore from "@/stores/userProfile";

export default function UserIcon() {
  // const { user,logout } = useAuth0();
  const { logout } = useFirebaseUser()
  const { userProfile } = useUserProfileStore()
  
  const [isVisible, setIsVisible] = useState(false); // トグルの状態を管理
  const toggleRef = useRef<HTMLDivElement>(null); // toggle要素への参照
  const toggleTargetRef = useRef<HTMLDivElement>(null); // toggleTarget要素への参照

  // ドキュメント全体のクリックを監視
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // toggleTargetまたはtoggleの外部がクリックされた場合に非表示
      if (
        toggleTargetRef.current &&
        !toggleTargetRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // if (session) {

    return (
      <>
        <div className="max-w-md">
          <div id="toggle" ref={toggleRef}
            onClick={(event) => {
              event.stopPropagation(); // クリックイベントの伝播を防ぐ
              setIsVisible((prev) => !prev); // 状態を切り替え
            }}
            className="cursor-pointer flex rounded-lg shadow-lx  hover:translate-y-1 hover:opacity-85 duration-200">
              <Image src={userProfile?.picture || ""} alt="UserIcon" width={10} height={10}  className="h-auto w-9 rounded-full"/>
              <div className="mt-0.5 ml-0.5">
                <p className='text-xs text-neutral-500'>{userProfile?.name}</p>
                <p className="text-xs text-neutral-500">{userProfile?.given_name}</p>
              </div>
            </div>
            {isVisible && (
              <div
                id="toggleTarget" ref={toggleTargetRef}
                className="z-50 border-solid border-neutral-300 border-2 absolute bg-white p-2 rounded-md w-32 translate-y-1 translate-x-[-15%]">
                <ul>
                    <button onClick={() => logout()} className="flex relative hover:bg-slate-200 rounded-sm p-1 pr-2">
                      <PiSignOut size={18} className="mt-0.5 mr-1.5 text-red-400" />
                      <p className="text-red-400">ログアウト</p>
                    </button>
                </ul>
            </div>)}
            <div>
          </div>
        </div>
      </>
    );
}
