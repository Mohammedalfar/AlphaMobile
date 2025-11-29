/* db.js – Final version (no OTP, email+password only) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLf1DOjLGHya_zui5GdonPDDo3qGMryMQ",
  authDomain: "alphamobilecyy.firebaseapp.com",
  projectId: "alphamobilecyy",
  storageBucket: "alphamobilecyy.firebasestorage.app",
  messagingSenderId: "330339001354",
  appId: "1:330339001354:web:d8167638947b00a830abf3"
};

const IMGBB_KEY = "0d5d7004a1b398898328dc1f199b7665";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const productCollection = collection(db, "products");

export { auth };

// PRODUCTS
export async function getProducts() {
  const snapshot = await getDocs(productCollection);
  let list = [];
  snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
  return list;
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method:"POST", body:fd });
  const json = await res.json();
  if (json.success) return json.data.url;
  throw new Error("Upload failed");
}

export async function addProductToDB(item) { await addDoc(productCollection, item); }
export async function updateProductInDB(id, data) { await updateDoc(doc(db,"products",id), data); }
export async function deleteProductFromDB(id) { await deleteDoc(doc(db,"products",id)); }

// AUTH
export async function registerUser(email, password, username, fullName = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    username: username,
    name: fullName || username,
    email: email,
    joined: new Date().toISOString(),
    ordersCount: 0,
    totalSpent: 0
  });
  return user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  return signOut(auth);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveOrderToDB(uid, total, items) {
  if (!uid) return;
  await addDoc(collection(db, "orders"), {
    userId: uid,
    items: items,
    total: total,
    date: new Date().toISOString(),
    status: "Pending"
  });
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ordersCount: increment(1),
    totalSpent: increment(total)
  });
}

export function subscribeToAuth(callback) {
  onAuthStateChanged(auth, callback);
}