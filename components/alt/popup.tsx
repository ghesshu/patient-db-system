import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface Props {
  dialogOpen?: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: React.ReactNode;
  content?: React.ReactNode;
  func?: any;
}

const Popup = ({ data }: { data: Props }) => {
  const { dialogOpen, setDialogOpen, title, content, func } = data; // Destructuring dialogOpen and setDialogOpen from data

  return (
    <div className="">
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}

      >
        <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
        <AlertDialogContent className="w-[30rem] md:w-[30rem] lg:w-[40rem] shadow-none rounded-2xl p-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white font-bold text-base">
              {title}
            </AlertDialogTitle>
            {/* <AlertDialogDescription className="">
             
            </AlertDialogDescription> */}
            {content}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Close</AlertDialogCancel> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Popup;
