import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import * as fs from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, DOMAIN, OPEN_HOUR, OPEN_MIN } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app), db = fs.getFirestore(app);
export { fs, signOut, onAuthStateChanged };
export const $ = (id) => document.getElementById(id);
export const signIn = () => { const p = new GoogleAuthProvider(); p.setCustomParameters({ hd: DOMAIN, prompt: "select_account" }); return signInWithPopup(auth, p); };
export const todayET = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
export const isWed = (d) => new Date(d + "T12:00:00Z").getUTCDay() === 3;
export const pretty = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

// Exact instant of h:m Eastern on date d (handles EST/EDT)
export function etInstant(d, h, m) {
  const hh = String(h).padStart(2, "0"), mm = String(m).padStart(2, "0");
  for (const off of [4, 5]) {
    const t = new Date(`${d}T${hh}:${mm}:00Z`); t.setUTCHours(t.getUTCHours() + off);
    const s = new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }).format(t);
    if (s === `${hh}:${mm}`) return t;
  }
}
export const meetingDoc = (d, open = true) => ({ open, opensAt: etInstant(d, OPEN_HOUR, OPEN_MIN), closesAt: etInstant(d, 23, 59) });
export const emailOf = (u) => u.email.toLowerCase();
export const has = async (col, id) => (await fs.getDoc(fs.doc(db, col, id))).exists();
