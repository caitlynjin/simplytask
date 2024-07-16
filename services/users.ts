import {
  setDoc,
  doc,
  collection,
  addDoc
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const createUser = async (userId: string, email: string) => {
  try {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
      email: email,
      userId: userId
    });
    // const tasksRef = collection(userRef, "tasks");
    // addDoc(tasksRef, {
    //   // Create tasks collection without adding a task
    // })
  } catch (error) {
    console.error("Error creating user", error);
  }
};