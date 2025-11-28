/* db.js - Connected to AlphaMobileCYY */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- I COPIED THESE FROM YOUR SCREENSHOT ---
const firebaseConfig = {
  apiKey: "AIzaSyCLf1DOjLGHya_zui5GdonPDDo3qGMryMQ",
  authDomain: "alphamobilecyy.firebaseapp.com",
  projectId: "alphamobilecyy",
  storageBucket: "alphamobilecyy.firebasestorage.app",
  messagingSenderId: "330339001354",
  appId: "1:330339001354:web:d8167638947b00a830abf3"
};
// -------------------------------------------

// --- YOUR IMGBB KEY (Keep this!) ---
const IMGBB_KEY = "0d5d7004a1b398898328dc1f199b7665"; 
// -----------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productCollection = collection(db, "products");

// 1. Fetch Products
export async function getProducts() {
  const snapshot = await getDocs(productCollection);
  let products = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
}

// 2. Upload Image to ImgBB
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  console.log("Uploading to ImgBB...");
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("Image upload failed");
  }
}

// 3. Add Product
export async function addProductToDB(item) {
  await addDoc(productCollection, item);
}

// 4. Delete Product
export async function deleteProductFromDB(id) {
  await deleteDoc(doc(db, "products", id));
}