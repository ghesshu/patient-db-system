"use client";
import Popup from "@/components/alt/popup";

import PageContainer from "@/components/layout/page-container";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { useQuery } from "react-query";

import { fetchTreatments } from "@/lib/api";
import Error from "@/components/alt/error";
import Spinner from "@/components/alt/spinner";
import NoData from "@/components/alt/nodata";

import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import EditTreatment from "@/components/view/treatment";
import NewTreatment from "@/components/new/new-treament";
import TreatmentCard from "@/components/cards/treatment";
import Pagination from "@/components/alt/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenTwo, setDialogOpenTwo] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [treatment, setMedicine] = React.useState<any>(null);
  const [loader, setLoader] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const queryClient = useQueryClient();
    const [search, setSearch] = React.useState<string | undefined>();
    const [limit, setLimit] = useState<string | undefined>("10");
    const [status, setStatus] = useState<string | undefined>("all");

  const { data, isLoading, error } = useQuery(["treatment", page, limit, search, status], () =>
    fetchTreatments({ page, limit, search, status })
  );

  const selectMedicine = (treatment: any) => {
    setMedicine(treatment);
    setDialogOpenTwo(true);
  };

  const mutation = useMutation(
    async (id: string) => {
      try {
        const res = await fetch(`/api/treatment?id=${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to delete treatment:", data.error);
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
          queryClient.invalidateQueries("treatment");
          toast.success("Treatment deleted successfully");
        } else {
          toast.error(result.message || "Error deleting entry"); // Display the error message from the server
        }
      },
      onError: () => {
        toast.error("Error deleting entry");
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
            <h1 className="text-2xl">Treatments</h1>
            <Button
              onClick={() => setDialogOpen(true)}
              className={"text-white rounded-md p-6"}
            >
              New Treatment
              <span className="ml-4 text-lg">
                <GoPlus />
              </span>
            </Button>
          </div>
          <Popup
            data={{
              dialogOpen,
              setDialogOpen,
              title: "New Treatment",
              content: (
                <NewTreatment
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  load={load}
                  setLoad={setLoad}
                />
              ),
            }}
          />
        </div>

        <div className="py-6 w-full space-y-4">
          <div className="flex items-center justify-between  w-full gap-2">
            <div className="w-full md:w-[8rem]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className=" flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full md:w-[8rem]">
                <Select
                  onValueChange={(e: any) => setLimit(e)}
                  defaultValue={limit}
                >
                  <SelectTrigger className="w-[8rem]">
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
              </div>
              <div className="w-full md:w-[8rem]">
                <Select
                  onValueChange={(e: any) => setStatus(e)}
                  defaultValue={status}
                >
                  <SelectTrigger className="w-[8rem]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className=" shadow-none">
                    <SelectGroup>
                      {/* <SelectLabel>Status</SelectLabel> */}
                      <SelectItem value="all">Status</SelectItem>

                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full min-w-[800px] overflow-y-scroll space-y-4">
            <div className="flex justify-between w-full items-center font-bold text-sm bg-neutral-200/50 dark:bg-neutral-800 p-2 rounded gap-3">
              <h2 className="w-[25%] text-left border-r-[1px] border-black">
                Name
              </h2>

              <h2 className="w-[25%] text-left border-r-[1px] border-black ">
                Created At
              </h2>
              <h2 className="w-[25%] text-left border-r-[1px] border-black">
                Status
              </h2>
              <h2 className="w-[25%] text-left  border-black">Actions</h2>
            </div>

            <div className="">
              {isLoading ? (
                <Spinner />
              ) : error ? (
                <Error />
              ) : data?.treatments?.length === 0 ? (
                <NoData />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {data?.treatments?.map((item: any) => (
                      <TreatmentCard
                        key={item._id}
                        data={item}
                        selectMedicine={selectMedicine}
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
          </div>
        </div>
        <Popup
          data={{
            dialogOpen: dialogOpenTwo,
            setDialogOpen: setDialogOpenTwo,
            title: "Edit Treatment",
            content: (
              <EditTreatment
                dialogOpen={dialogOpenTwo}
                setDialogOpen={setDialogOpenTwo}
                load={load}
                setLoad={setLoad}
                datam={treatment}
              />
            ),
          }}
        />
      </PageContainer>
    </div>
  );
};

export default Page;
