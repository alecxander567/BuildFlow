import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
};

export function useUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(
        snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }) as AppUser),
      );
      setLoaded(true);
    };
    fetch();
  }, []);

  const getUserById = (uid: string) => users.find((u) => u.uid === uid) ?? null;

  return { users, loaded, getUserById };
}
