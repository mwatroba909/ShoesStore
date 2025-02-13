import { create } from "zustand";
import axios from "../api/axios.js";
import { toast } from "react-hot-toast";

export const useUser = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Hasła nie są takie same");
		}

		try {
			const res = await axios.post("/auth/zarejestruj", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message);
		}
	},
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/zaloguj", { email, password });

            console.log("uzytkownik zalogowany", res.data)
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message);
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/wyloguj");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/odswiez_token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));