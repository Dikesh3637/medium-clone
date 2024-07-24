import { create } from "zustand";
import { JWTPayloadType } from "@repo/typing/auth";

interface SignUpFormState {
	ToggleSignUp: boolean;
	TogglePopup: () => void;
	popUpType: "sign-up" | "sign-in";
	setPopUpType: (popUpType: "sign-up" | "sign-in") => void;
}

export const useSignUpFormStore = create<SignUpFormState>((set) => ({
	ToggleSignUp: false,
	popUpType: "sign-up",
	TogglePopup: () => set((state) => ({ ToggleSignUp: !state.ToggleSignUp })),
	setPopUpType: (popUpType: "sign-up" | "sign-in") =>
		set({ popUpType: popUpType }),
}));

interface UserState {
	username: string;
	setUsername: (username: string) => void;
	email: string;
	setEmail: (email: string) => void;
	userId: string;
	setUserId: (userId: string) => void;
	setUser: (user: JWTPayloadType) => void;
}

export const useUserStore = create<UserState>((set) => ({
	username: "",
	email: "",
	userId: "",
	setUsername: (username: string) =>
		set((state) => ({ ...state, username: username })),
	setEmail: (email: string) => set({ email: email }),
	setUserId: (userId: string) => set({ userId: userId }),
	setUser: (user: JWTPayloadType) =>
		set({ username: user.username, email: user.email, userId: user.id }),
}));
