// src/store/authStore.ts
// The nav bar, the login page and ProtectedRoute all need to know whether
// anyone is signed in. A store is a box any component can read from directly,
// so the token never has to be passed down as a prop.
//
// SESSION 7: a store is just a JavaScript variable, so a refresh used to throw
// the token away. persist wraps the store and syncs it to localStorage on every
// change -- the store's own shape is untouched.
import { create } from "zustand";
import { persist } from "zustand/middleware";

// The shape of the store: its data AND the functions that change it
interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

// Note the extra () after create<AuthState>. Without middleware you wrote
// create<AuthState>((set) => ...). With middleware TypeScript needs that empty
// call first, or the generic stops working.
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      login: (name) => set({ token: `demo-token-${name}`, userName: name }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth", // the localStorage key it writes to
      // Save ONLY these two fields. Without partialize, Zustand tries to save
      // the whole state -- and functions cannot become JSON, so login and
      // logout would silently vanish. They do not need saving anyway: they
      // come back from this file when the store is rebuilt on load.
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;
