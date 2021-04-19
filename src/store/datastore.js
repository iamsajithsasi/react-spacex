import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSpaceXData = createAsyncThunk(
  "spacex/fetchSpaceXData",
  async () => {
    return fetch("https://api.spacexdata.com/v3/launches").then((res) =>
      res.json()
    );
  }
);

export const dupSpaceXData = createAsyncThunk(
  "spacex/dupSpaceXData",
  async () => {
    return fetch("https://api.spacexdata.com/v3/launches").then((res) =>
      res.json()
    );
  }
);

export const spaceXSlice = createSlice({
  name: "spacex",
  initialState: {
    data: [],
    dup: [],
    status: "init",
  },
  reducers: {
    updateSpaceXData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [fetchSpaceXData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "success";
    },
    [fetchSpaceXData.rejected]: (state, action) => {
      state.data = [];
      state.status = "failed";
    },
    [fetchSpaceXData.pending]: (state, action) => {
      state.data = [];
      state.status = "pending";
    },
    [dupSpaceXData.fulfilled]: (state, action) => {
      state.dup = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSpaceXData } = spaceXSlice.actions;

export default spaceXSlice.reducer;
