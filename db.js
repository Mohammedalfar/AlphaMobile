/* db.js – 100% WORKING VERSION (Nov 2025) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your config (storageBucket fixed)
const firebaseConfig = {
  apiKey: "AIzaSyClF1DOjLGHya_zuI5GdonPDDo3qGMryMQ",
  authDomain: "alphamobilecyy.firebaseapp.com",
  projectId: "alphamobilecyy",
  storageBucket: "alphamobilecyy.appspot.com",
  messagingSenderId: "330339001354",
  appId: "1:330339001354:web:d8167638947b00a830abf3",
  measurementId: "G-5GSKB3F1TK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };

// PRODUCTS
export async function getProducts() {
  const q = collection(db, "products");
  const snap = await getDocs(q);
  const list = [];
  snap.forEach(d => list.push({ id: d.id, ...d.data() }));
  return list;
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const r = await fetch("https://api.imgbb.com/1/upload?key=0d5d7004a1b398898328dc1f199b7665", {
    method: "POST", body: fd
  });
  const j = await r.json();
  return j.data.url;
}

export async function addProductToDB(item) { await addDoc(collection(db, "products"), item); }
export async function updateProductInDB(id, data) { await updateDoc(doc(db, "products", id), data); }
export async function deleteProductFromDB(id) { await deleteDoc(doc(db, "products", id)); }

// AUTH
export async function registerUser(email, password, username, fullName = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    username,
    name: fullName || username,
    email,
    joined: new Date().toISOString(),
    ordersCount: 0,
    totalSpent: 0
  });
  return cred.user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() { await signOut(auth); }

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveOrderToDB(uid, total, items) {
  if (!uid) return;
  await addDoc(collection(db, "orders"), { userId: uid, items, total, date: new Date().toISOString(), status: "Pending" });
  await updateDoc(doc(db, "users", uid), {
    ordersCount: increment(1),
    totalSpent: increment(total)
  });
}

export function subscribeToAuth(cb) {
  onAuthStateChanged(auth, cb);
}