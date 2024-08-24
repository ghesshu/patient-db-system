import React from "react";

const Spinner = () => {
  return (
    <div className="h-[30rem] w-full flex justify-center items-center ">
      <h1 className="h-[3rem] w-[3rem] border-2 border-primary border-b-transparent border-dashed animate-spin rounded-full"></h1>
    </div>
  );
};

export default Spinner;
