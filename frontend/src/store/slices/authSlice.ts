import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthProfile } from "@/lib/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  profile: AuthProfile | null;
}

const initialState: AuthState = {
  status: "loading",
  profile: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = "loading";
      state.profile = null;
    },
    setAuthenticated: (state, action: PayloadAction<AuthProfile>) => {
      state.status = "authenticated";
      state.profile = action.payload;
    },
    setUnauthenticated: (state) => {
      state.status = "unauthenticated";
      state.profile = null;
    },
  },
});

export const { setAuthLoading, setAuthenticated, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
