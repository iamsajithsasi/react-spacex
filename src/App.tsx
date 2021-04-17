import React, { useState, useEffect, lazy, Suspense } from "react";
// import './App.css';
import { useDispatch } from "react-redux";
import ErrorboundaryBox from "./component/errorboundary";
import LoaderBox from "./component/loader";
import { fetchSpaceXData } from "./store/datastore";

const SpaceBlog = lazy(() => import("./component/blog"));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSpaceXData())
  }, [dispatch]);

  return (
    <div className="bg-light min-vh-100">
      <ErrorboundaryBox>
        <Suspense fallback={<LoaderBox />}>
          <SpaceBlog />
        </Suspense>
      </ErrorboundaryBox>
    </div>
  );
}

export default App;