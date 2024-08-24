import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { RiMore2Line } from "react-icons/ri";
import { formatDate } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const PatientCard = ({ data, onDelete, loader, num }: any) => {
  const getText = (text: string) => {
    return text[0].toUpperCase();
  };
  return (
    <div className="text-sm w-full h-[3.5rem] flex justify-between items-center bg-white dark:bg-neutral-900 rounded-md p-2 px-3 gap-3">
      <h2 className="w-[5%] text-center">{num}</h2>
      <h2 className="w-[20%] flex items-center ">
        <Avatar className="h-9 w-9 ">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-green-200/30 text-green-600">
            {getText(data?.fullname)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{data?.fullname}</p>
          <p className="text-xs text-muted-foreground ">{data?.phone}</p>
        </div>
      </h2>
      <h2 className="w-[15%] text-left">{formatDate(data?.createdAt)}</h2>
      <h2 className="w-[15%] text-left text-[0.6rem]">
        {data?.gender === "male" ? (
          <span className="text-green-500 p-1 px-4 rounded-xl bg-green-200/30">
            Male
          </span>
        ) : (
          <span className="text-orange-500 p-1 px-4 rounded-xl bg-orange-200/30">
            Female
          </span>
        )}
      </h2>

      <h2 className="w-[15%] text-left">
        {data?.bloodgroup ? data.bloodgroup : "N/A"}
      </h2>
      <h2 className="w-[15%] text-left">{data?.age}</h2>
      <div className="w-[15%] flex items-center justify-between gap-2">
        <Link
          className="text-xl h-[2rem] w-full flex items-center justify-center hover:text-primary bg-neutral-200 rounded dark:bg-neutral-800"
          href={`/dashboard/patients/${data?._id}`}
        >
          <RiMore2Line />
        </Link>
        {/* <button>
         
        </button> */}
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

export default PatientCard;
