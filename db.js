/* db.js - Updated for Auth, Stats, & Phone OTP */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, PhoneAuthProvider, signInWithCredential,
  RecaptchaVerifier
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

// Expose auth for global use
export { auth };

// Recaptcha for Phone OTP (must be called before sendCode)
let recaptchaVerifier;

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
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: formData });
  const data = await response.json();
  if (data.success) return data.data.url;
  throw new Error("Image upload failed");
}

export async function addProductToDB(item) { await addDoc(productCollection, item); }
export async function updateProductInDB(id, data) { await updateDoc(doc(db, "products", id), data); }
export async function deleteProductFromDB(id) { await deleteDoc(doc(db, "products", id)); }

// --- AUTH & USER STATS ---

// 1. Sign Up with Email, Username, Phone + OTP
export async function registerUser(email, password, username, name, phone) {
  try {
    // Create user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send OTP to phone
    const confirmationResult = await sendOTP(phone);
    // In login.html, user will confirm OTP before completing registration
    
    // Create User Profile in Firestore (after OTP, but placeholder here)
    await setDoc(doc(db, "users", user.uid), {
      username: username,  // New field for username
      name: name,
      email: email,
      phone: phone,
      joined: new Date().toISOString(),
      ordersCount: 0,
      totalSpent: 0
    });
    return { user, confirmationResult };  // Return confirmation for OTP handling
  } catch (error) {
    throw new Error("Registration failed: " + error.message);
  }
}

// 2. Send OTP to Phone
export async function sendOTP(phoneNumber) {
  recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);  // Invisible reCAPTCHA
  const provider = new PhoneAuthProvider(auth);
  const confirmationResult = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
  return confirmationResult;
}

// 3. Verify OTP and Complete Sign In
export async function verifyOTP(confirmationResult, otpCode) {
  const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otpCode);
  return await signInWithCredential(auth, credential);
}

// 4. Sign In with Email + OTP
export async function loginUser(email, password, phone, otpCode) {
  try {
    // First, sign in with email/password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Then verify phone if provided
    if (phone && otpCode) {
      // Assume confirmationResult is stored or resent; for simplicity, resend if needed
      const confirmationResult = await sendOTP(phone);
      await verifyOTP(confirmationResult, otpCode);
    }
    return userCredential.user;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}

// 5. Sign Out
export async function logoutUser() {
  return await signOut(auth);
}

// 6. Get Current User Profile
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data();
  return null;
}

// 7. Save Order & Update Stats
export async function saveOrderToDB(uid, cartTotal, items) {
  if(!uid) return;
  
  // A. Save the order record
  await addDoc(collection(db, "orders"), {
    userId: uid,
    items: items,
    total: cartTotal,
    date: new Date().toISOString(),
    status: "Pending"
  });

  // B. Update User Stats (Atomic Increment)
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ordersCount: increment(1),
    totalSpent: increment(cartTotal)
  });
}

// 8. Auth Listener
export function subscribeToAuth(callback) {
  onAuthStateChanged(auth, callback);
}