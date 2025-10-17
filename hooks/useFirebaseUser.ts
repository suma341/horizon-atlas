import { auth } from "@/lib/fireabase";
import useUserProfileStore from "@/stores/userProfile";
import { onAuthStateChanged, signInWithCustomToken, signOut, User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useFirebaseUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const {setUserProfile} = useUserProfileStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithCustomToken = async (token: string) => {
    setLoading(true);
    try {
      await signInWithCustomToken(auth, token);
    } finally {
      setLoading(false);
    }
  };

  // サインアウト
  const logout = async () => {
    setLoading(true);
    try {
      setUserProfile(null)
      await signOut(auth);
    } finally {
      setLoading(false);
      router.push("/")
    }
  };

  return { user, loading, loginWithCustomToken, logout };
};

export default useFirebaseUser