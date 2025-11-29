/* db.js - Auth & Database Logic */

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const productCollection = collection(db, "products");

// --- PRODUCTS ---
export async function getProducts() {
  const snapshot = await getDocs(productCollection);
  let products = [];
  snapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));
  return products;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  // Using the key provided in your original file
  const response = await fetch(`https://api.imgbb.com/1/upload?key=0d5d7004a1b398898328dc1f199b7665`, { method: "POST", body: formData });
  const data = await response.json();
  if (data.success) return data.data.url;
  throw new Error("Image upload failed");
}

export async function addProductToDB(item) { await addDoc(productCollection, item); }
export async function updateProductInDB(id, data) { await updateDoc(doc(db, "products", id), data); }
export async function deleteProductFromDB(id) { await deleteDoc(doc(db, "products", id)); }

// --- AUTH SYSTEM ---

// 1. Sign Up & Create Profile
export async function registerUser(email, password, name, phone) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create User Profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    name: name,
    email: email,
    phone: phone,
    joined: new Date().toISOString(),
    ordersCount: 0,
    totalSpent: 0
  });
  return user;
}

// 2. Sign In
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// 3. Sign Out
export async function logoutUser() {
  return await signOut(auth);
}

// 4. Get Profile Data
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data();
  return null;
}

// 5. Save Order & Update Stats
export async function saveOrderToDB(uid, cartTotal, items) {
  if(!uid) return;
  
  // Record the order
  await addDoc(collection(db, "orders"), {
    userId: uid,
    items: items,
    total: cartTotal,
    date: new Date().toISOString(),
    status: "Pending"
  });

  // Increment User Stats
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ordersCount: increment(1),
    totalSpent: increment(cartTotal)
  });
}

// 6. Auth State Listener
export function subscribeToAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// 7. Get Current Auth Object (for sync checks)
export function getAuthInstance() {
  return auth;
}
