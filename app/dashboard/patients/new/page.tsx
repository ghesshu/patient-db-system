"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import NewPatient from "@/components/new/new-patient";

const Page = () => {
  const router = useRouter(); // Initialize the useRouter hook

  return (
    <div>
      <PageContainer scrollable={true}>
        <div className="w-full flex items-center gap-4">
          <Button
            className="text-white rounded-md p-3 text-2xl"
            onClick={() => router.back()} // Use the back method to navigate to the previous page
          >
            <IoIosArrowRoundBack />
          </Button>
          <h1 className="text-2xl">New Patient</h1>
        </div>

        <NewPatient />
      </PageContainer>
    </div>
  );
};

export default Page;
