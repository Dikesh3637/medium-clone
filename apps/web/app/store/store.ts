
import { create } from "zustand";

interface SignUpFormState {
    ToggleSignUp: boolean,
    setToggleSignUp: () => void,
    popUpType: "sign-up" | "sign-in",
    setPopUpType: (popUpType: "sign-up" | "sign-in") => void
}

export const useSignUpFormStore = create<SignUpFormState>((set) => ({
    ToggleSignUp: false,
    popUpType: "sign-up",
    setToggleSignUp: () => set((state) => ({ ToggleSignUp: !state.ToggleSignUp })),
    setPopUpType: (popUpType: "sign-up" | "sign-in") => set({ popUpType: popUpType })
})) 
