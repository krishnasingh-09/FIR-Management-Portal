import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserStore {
    role: Role;
    setRole: (role: Role) => void;
    userAddress: string;
    setUserAddress: (userAddress: string) => void;
}

interface HandleComplaintStore {
    complaint: Complaint | null;
    setComplaint: (complaint: Complaint) => void;
}

export enum Role {
    ADMIN = "Admin",
    POLICE = "Police",
    NULL = 0 as const,
}

export const userUserStore = create<UserStore, any>(
    persist((set) => ({
    role: Role.NULL,
    setRole: (role: Role) => set({ role }),

    userAddress: "",
    setUserAddress: (userAddress: string) => set({ userAddress }),
    }), {
      name: 'set-role', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },)
)

export const useHandleComplaintStore = create<HandleComplaintStore>((set) => ({
    complaint: null,
    setComplaint: (complaint: Complaint) => set({ complaint }),
}));
