import { configureStore } from "@reduxjs/toolkit";
import spaceXSlice from "./datastore";

export default configureStore({
  reducer: {
    spacex: spaceXSlice,
  },
});
