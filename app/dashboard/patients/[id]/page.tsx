"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchPatientById } from "@/lib/api";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegChartBar } from "react-icons/fa";
import { LuHeart } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import HealthForm from "@/components/patient/health-form";
import PatientForm from "@/components/patient/patient-form";
import PatientRecord from "@/components/patient/record-form";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [load, setLoad] = useState(false);
  const [load1, setLoad1] = useState(false);
  const [load2, setLoad2] = useState(false);

  const { data, isLoading, error } = useQuery(
    ["patient", id],
    () => fetchPatientById(id as string),
    {
      enabled: !!id,
    }
  );

  const [selectedView, setSelectedView] = useState("medicalRecords");

  useEffect(() => {
    if (data) {
      console.log("Fetched patient data:", data);
    }
  }, [data]);

  return (
    <div>
      <PageContainer scrollable={true}>
        <div className="w-full flex items-center gap-4 mb-[3rem]">
          <Button
            className="text-white rounded-md p-3 text-2xl"
            onClick={() => router.back()} // Use the back method to navigate to the previous page
          >
            <IoIosArrowRoundBack />
          </Button>
          <h1 className="text-2xl"> {data ? data.fullname : "Patient"} </h1>
        </div>

        <div className="w-full flex justify-between gap-4">
          <div className="flex-shrink-0 w-[20rem] bg-white dark:bg-neutral-900 py-[2rem] rounded-2xl max-h-[27rem] ">
            <div className="text-center space-y-1">
              <h2 className="font-bold text-base ">
                {data ? data.fullname : "Patient"}
              </h2>
              <h3 className="text-sm text-neutral-300">
                {data ? data.email : "Email"}{" "}
              </h3>
              <h3 className="">{data ? data.phonenumber : "Tel"} </h3>
            </div>

            <div className="flex flex-col items-center w-full gap-4 mt-[2rem]">
              <Button
                className={`h-[3rem] ${
                  selectedView === "medicalRecords"
                    ? "bg-green-100 text-green-600 border-green-600 border "
                    : "bg-neutral-200 text-black/80"
                } shadow-none text-xs w-[12rem] flex justify-start hover:bg-green-100 hover:text-green-600 `}
                onClick={() => setSelectedView("medicalRecords")}
                disabled={selectedView === "medicalRecords"}
              >
                <h3 className="mr-2 text-base">
                  <FaRegChartBar />
                </h3>
                <h3>Medical Records</h3>
              </Button>
              <Button
                className={`h-[3rem] ${
                  selectedView === "patientInformation"
                    ? "bg-green-100 text-green-600 border-green-600 border "
                    : "bg-neutral-200 text-black/80"
                } shadow-none text-xs w-[12rem] flex justify-start hover:bg-green-100 hover:text-green-600`}
                onClick={() => setSelectedView("patientInformation")}
                disabled={selectedView === "patientInformation"}
              >
                <h3 className="mr-2 text-base">
                  <GoPerson />
                </h3>
                <h3>Patient Information</h3>
              </Button>
              <Button
                className={`h-[3rem] ${
                  selectedView === "healthInformation"
                    ? "bg-green-100 text-green-600 border-green-600 border "
                    : "bg-neutral-200 text-black/80"
                } shadow-none text-xs w-[12rem] flex justify-start hover:bg-green-100 hover:text-green-600`}
                onClick={() => setSelectedView("healthInformation")}
                disabled={selectedView === "healthInformation"}
              >
                <h3 className="mr-2 text-base">
                  <LuHeart />
                </h3>
                <h3>Health Information</h3>
              </Button>
              <Button
                className={`h-[3rem] ${
                  selectedView === "newrecord"
                    ? "bg-green-100 text-green-600 border-green-600 border "
                    : "bg-neutral-200 text-black/80"
                } shadow-none text-xs w-[12rem] flex justify-start hover:bg-green-100 hover:text-green-600`}
                onClick={() => setSelectedView("newrecord")}
                disabled={selectedView === "newrecord"}
              >
                <h3 className="mr-2 text-base">
                  <LuHeart />
                </h3>
                <h3>New Record</h3>
              </Button>
            </div>
          </div>

          <div className="w-full bg-white p-4 rounded-xl overflow-x-hidden dark:bg-neutral-900">
            <AnimatePresence mode="wait">
              {selectedView === "medicalRecords" && (
                <motion.div
                  key="medicalRecords"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              )}
              {selectedView === "patientInformation" && (
                <motion.div
                  key="patientInformation"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <PatientForm
                    load={load1}
                    setLoad={setLoad1}
                    id={id as string}
                    patient={data}
                  />
                </motion.div>
              )}
              {selectedView === "healthInformation" && (
                <motion.div
                  key="healthInformation"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <HealthForm
                    load={load}
                    setLoad={setLoad}
                    id={id as string}
                    patient={data?.info}
                  />
                </motion.div>
              )}
              {selectedView === "newrecord" && (
                <motion.div
                  key="newrecord"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <PatientRecord
                    load={load2}
                    setLoad={setLoad2}
                    id={id as string}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Page;
