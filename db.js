/* db.js - Database + ImgBB Images */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- YOUR FIREBASE CONFIG ---
// (Ensure this matches the one you copied from Firebase Console earlier)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "alphamobilefree.firebaseapp.com",
  projectId: "alphamobilefree",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
// ----------------------------

// --- YOUR IMGBB KEY (Added Automatically) ---
const IMGBB_KEY = "0d5d7004a1b398898328dc1f199b7665";
// --------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productCollection = collection(db, "products");

// 1. Fetch Products from Database
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
    console.log("Upload Success:", data.data.url);
    return data.data.url; // The public internet link for the image
  } else {
    throw new Error("Image upload failed: " + (data.error ? data.error.message : "Unknown error"));
  }
}

// 3. Save Product Info to Database
export async function addProductToDB(item) {
  await addDoc(productCollection, item);
}

// 4. Delete Product
export async function deleteProductFromDB(id) {
  await deleteDoc(doc(db, "products", id));
}