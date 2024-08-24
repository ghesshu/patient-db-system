import React from "react";
import { TfiDropboxAlt } from "react-icons/tfi";

const NoData = () => {
  return (
    <div className="h-[25rem]  w-full rounded-lg flex justify-center items-center mt-8">
      <div className="flex flex-col items-center">
        <h1 className="text-[8rem] text-neutral-300/50">
          <TfiDropboxAlt />
        </h1>
        <h1 className="font-bold text-neutral-300">No data available</h1>
      </div>
    </div>
  );
};

export default NoData;
