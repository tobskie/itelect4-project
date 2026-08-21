// src/store/uiStore.ts -- a NEW file
// Dark mode lived in Layout, the search term lived in SessionsPage, and the
// card density lived in bookingStore next to server data it had nothing to do
// with. None of the three belonged there -- they are all settings ABOUT the
// whole app, so they belong in one store that answers "how does the app look".
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Both cards accept variant?: "default" | "compact", so the density toggle in
// the nav bar has to be readable from every page.
export type CardVariant = "default" | "compact";

interface UiState {
  isDarkMode: boolean;
  searchTerm: string;
  cardVariant: CardVariant;
  toggleDarkMode: () => void;
  setSearchTerm: (term: string) => void;
  setCardVariant: (variant: CardVariant) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      searchTerm: "",
      cardVariant: "default",

      // set() takes a FUNCTION when the new value depends on the old one --
      // exactly like setValue((prev) => !prev) in useToggle.
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      // The plain form, for when the new value does not depend on the old one.
      setSearchTerm: (term) => set({ searchTerm: term }),
      setCardVariant: (variant) => set({ cardVariant: variant }),
    }),
    {
      name: "itelect4-ui",
      // The theme and the chosen density are worth remembering. The search box
      // is not -- coming back to a page still filtered by last week's query
      // would only confuse people.
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        cardVariant: state.cardVariant,
      }),
    }
  )
);

export default useUiStore;
