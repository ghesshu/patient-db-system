"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { useQuery } from "react-query";
import { fetchPatients } from "@/lib/api";
import Error from "@/components/alt/error";
import Spinner from "@/components/alt/spinner";
import NoData from "@/components/alt/nodata";
import PatientCard from "@/components/cards/patient";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/alt/pagination";
import Link from "next/link";

const Page = () => {
  const defaultFromDate = "2000-01-01";
  const defaultToDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

  const [fromDate, setFromDate] = useState<string>(defaultFromDate);
  const [toDate, setToDate] = useState<string>(defaultToDate);
  const [gender, setGender] = useState<string | undefined>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | undefined>("newest");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<string | undefined>("10");
  const [search, setSearch] = useState<string | undefined>();
  const [loader, setLoader] = React.useState(false);
  const queryClient = useQueryClient();

  const dateRange = `${fromDate} - ${toDate}`;

  const { data, isLoading, error, refetch } = useQuery(
    ["patients", gender, dateRange, sort, page, limit, search],
    () => fetchPatients({ gender, dateRange, sort, page, limit, search })
  );

  const handleSearch = () => {
    refetch();
  };

  const mutation = useMutation(
    async (id: string) => {
      try {
        const res = await fetch(`/api/patient?id=${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to delete Patient:", data.error);
          return { success: false, message: data.error }; // Return the error message from the server
        }

        return { success: true, data }; // Return success with the data
      } catch (error) {
        console.error("Error occurred during deletion:", error);
        return { success: false, message: "An unexpected error occurred" }; // Handle unexpected errors
      }
    },
    {
      onSuccess: (result) => {
        if (result.success) {
          queryClient.invalidateQueries("patients");
          toast.success("Patient deleted successfully");
        } else {
          toast.error(result.message || "Error deleting Patient"); // Display the error message from the server
        }
      },
      onError: () => {
        toast.error("Error deleting Patient");
      },
      onSettled: () => {
        setLoader(false);
      },
    }
  );

  const onDelete = (id: string) => {
    setLoader(true);
    mutation.mutate(id);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);

    // Adjust the "to" date if it is before the new "from" date
    if (toDate < newFromDate) {
      setToDate(newFromDate);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
    } else {
      alert("The 'To' date cannot be earlier than the 'From' date.");
    }
  };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1); // Increment currentPage
  };

  const prevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage)); // Decrement currentPage, but ensure it doesn't go below 1
  };

  const goToPage = (page: any) => {
    setPage(page);
  };

  return (
    <div>
      <PageContainer scrollable={true}>
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl">Patients</h1>
            <Link href={`/dashboard/patients/new`}>
              <Button className={"text-white rounded-md p-6"}>
                New Patient
                <span className="ml-4 text-lg">
                  <GoPlus />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="py-6 w-full space-y-4">
          <div className="grid grid-cols-6 gap-2 ">
            <div className="w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className=" flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              />
            </div>
            <Select
              onValueChange={(e: any) => setLimit(e)}
              defaultValue={limit}
            >
              <SelectTrigger className="w-[rem]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className=" shadow-none">
                <SelectGroup>
                  {/* <SelectLabel>Status</SelectLabel> */}
                  <SelectItem value="10">Limit</SelectItem>

                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* ///////////////// */}

            <Select onValueChange={(e: any) => setSort(e)} defaultValue={sort}>
              <SelectTrigger className="w-[rem]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className=" shadow-none">
                <SelectGroup>
                  {/* <SelectLabel>Status</SelectLabel> */}
                  <SelectItem value="10">Sort By</SelectItem>

                  <SelectItem value="newest">Newwest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* ///////////////////// */}

            <Select
              onValueChange={(e: any) => setGender(e)}
              defaultValue={gender}
            >
              <SelectTrigger className="w-[rem]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className=" shadow-none">
                <SelectGroup>
                  {/* <SelectLabel>Status</SelectLabel> */}
                  <SelectItem value="all">Gender</SelectItem>

                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="w-full">
              <input
                placeholder="from"
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="to"
                type="date"
                value={toDate}
                min={fromDate} // Ensures "to" date cannot be earlier than "from" date
                onChange={handleToDateChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              />
            </div>
          </div>
          <div className="flex justify-between w-full items-center font-bold text-xs bg-neutral-200/50 dark:bg-neutral-800 p-2 rounded gap-3">
            <h2 className="w-[5%] text-left border-r-[1px] border-black">NO</h2>
            <h2 className="w-[20%] text-left border-r-[1px] border-black">
              Patient
            </h2>
            <h2 className="w-[15%] text-left border-r-[1px] border-black">
              Created At
            </h2>
            <h2 className="w-[15%] text-left border-r-[1px] border-black ">
              Gender
            </h2>
            <h2 className="w-[15%] text-left border-r-[1px] border-black">
              Blood Group
            </h2>
            <h2 className="w-[15%] text-left border-r-[1px] border-black">
              Age
            </h2>
            <h2 className="w-[15%] text-left  border-black">Actions</h2>
          </div>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Error />
          ) : data.patients.length === 0 ? (
            <NoData />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {data?.patients?.map((item: any, index: number) => (
                  <PatientCard
                    key={index}
                    num={index + 1}
                    data={item}
                    onDelete={onDelete}
                    loader={loader}
                  />
                ))}
              </div>

              <Pagination
                page={page}
                prevPage={prevPage}
                totalNum={data?.totalPages ? data?.totalPages : 0}
                goToPage={goToPage}
                nextPage={nextPage}
              />
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Page;
