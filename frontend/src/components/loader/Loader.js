import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <>
      <div>
        <button className="btn btn-primary" type="button" disabled>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </button>
      </div>
    </>
  );
};

export default Loader;
