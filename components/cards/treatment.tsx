import React from "react";
import { RiMore2Line } from "react-icons/ri";
import { LuTrash2 } from "react-icons/lu";
import { formatDate } from "@/lib/api";

const TreatmentCard = ({ data, selectMedicine, onDelete, loader }: any) => {
  return (
    <div className="text-sm w-full h-[3rem] flex justify-between items-center bg-white dark:bg-neutral-900 rounded-md p-2 px-3 gap-3">
      <h2 className="w-[25%] text-left">{data?.name}</h2>
      <h2 className="w-[25%] text-left">{formatDate(data?.createdAt)}</h2>
      <h2 className="w-[25%] text-left text-xs">
        {data?.status === true ? (
          <span className="text-green-500">Enabled </span>
        ) : (
          <span className="text-red-500">Disabeled</span>
        )}
      </h2>

      <div className="w-[25%] flex items-center justify-between gap-2">
        <button
          onClick={() => selectMedicine(data)}
          className="text-xl h-[2rem] w-full flex items-center justify-center hover:text-primary bg-neutral-200 rounded dark:bg-neutral-800"
        >
          <RiMore2Line />
        </button>
        <button
          disabled={loader}
          onClick={() => onDelete(data._id)}
          className="text-xl h-[2rem] w-full flex items-center justify-center
           rounded dark:bg-neutral-800 bg-red-100 text-red-500"
        >
          <LuTrash2 />
        </button>
      </div>
    </div>
  );
};

export default TreatmentCard;
