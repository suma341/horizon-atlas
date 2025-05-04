import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./fireabase"
import { Profile } from "@/types/profile";

export const saveUserProfile = async (profile:Profile) => {
  const user = auth.currentUser;
  if (!user) return;
  if(!profile.profile) return;

  const userDocRef = doc(db, "users", user.uid);

  await setDoc(userDocRef, profile);
};

export async function fetchUser(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userData = docSnap.data() as Profile
    return userData 
  } else {
    console.log("データが存在しません");
    return null;
  }
}