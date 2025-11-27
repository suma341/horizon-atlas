import { openDB } from "idb";
import { Profile } from "@/types/profile";

const dbPromise = openDB("atlas-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("profiles")) {
      db.createObjectStore("profiles", { keyPath: "user_id" });
    }
  },
});

export default class UserDataGW{
  static save = async (profile: Profile) => {
    const db = await dbPromise;
    await db.put("profiles", profile );
  };

  static get = async (user_id:string): Promise<Profile | null> => {
    const db = await dbPromise;
    const result = await db.get("profiles", user_id);
    return result ?? null;
  };

  static delete = async (user_id:string) => {
    const db = await dbPromise;
    await db.delete("profiles", user_id);
  };
}