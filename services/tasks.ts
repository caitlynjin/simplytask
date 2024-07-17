import {
  setDoc,
  doc,
  collection,
  addDoc
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const createTask = async (
  userId: string,
  name: string,
  description: string
) => {
  try {
    const userRef = doc(db, "users", userId)
    const tasksRef = collection(userRef, "tasks");
    addDoc(tasksRef, {
      name: name,
      description: description
    });
  } catch (error) {
    console.error("Error creating task", error);
  }
};