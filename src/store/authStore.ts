// src/store/authStore.ts
// The nav bar, the login page and ProtectedRoute all need to know whether
// anyone is signed in. A store is a box any component can read from directly,
// so the token never has to be passed down as a prop.
//
// SESSION 7: a store is just a JavaScript variable, so a refresh used to throw
// the token away. persist wraps the store and syncs it to localStorage on every
// change -- the store's own shape is untouched.
//
// ===== SESSIONS 6-8: the store invented its own token ===================
//   login: (name: string) => void;
//   login: (name) => set({ token: `demo-token-${name}`, userName: name }),
//
// NOTE: That token was a string this file made up. Nothing checked it,
//       because nothing could -- ProtectedRoute only ever asked whether it
//       was null. A real token is issued by /api/auth/login and signed with
//       a secret only the API knows.
// ===== GT4 PART 2: the store keeps a token it was given =================
import { create } from "zustand";
import { persist } from "zustand/middleware";

// The shape of the store: its data AND the functions that change it
interface AuthState {
  token: string | null;
  userName: string | null;
  // Two values in, nothing invented. The login page gets them from the API
  // and hands them here.
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

// This file deliberately does not import ../api/client. client.ts reads the
// token out of this store on every request, so a store that called client.ts
// back would be an import loop. Fetching stays in the pages, state stays here.
//
// Note the extra () after create<AuthState>. Without middleware you wrote
// create<AuthState>((set) => ...). With middleware TypeScript needs that empty
// call first, or the generic stops working.
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setSession: (token, userName) => set({ token, userName }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth", // the localStorage key it writes to
      // Save ONLY these two fields. Without partialize, Zustand tries to save
      // the whole state -- and functions cannot become JSON. They do not need
      // saving anyway: they come back from this file when the store is rebuilt.
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;

// The token is good for two hours -- the expiresIn in itelect4-backend's login
// route. persist keeps it across a reload, so the app can come back holding one
// the API has already stopped accepting: the next request answers 401, and
// Logout then log in again is the fix.
