"use client";
import Popup from "@/components/alt/popup";
import MedicineCard from "@/components/cards/medicine";
import PageContainer from "@/components/layout/page-container";
import NewMeds from "@/components/new/new-medicine";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { useQuery } from "react-query";

import { fetchMedicines } from "@/lib/api";
import Error from "@/components/alt/error";
import Spinner from "@/components/alt/spinner";
import NoData from "@/components/alt/nodata";
import EditMeds from "@/components/view/medicine";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
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

const page = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenTwo, setDialogOpenTwo] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [medicine, setMedicine] = React.useState<any>(null);
  const [loader, setLoader] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string | undefined>();
  const [stockStatus, setStockStatus] = React.useState("all");
  const [limit, setLimit] = useState<string>("10");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ["medicine", page, search, stockStatus],
    () => fetchMedicines({ page, limit, search, stockStatus })
  );

  const selectMedicine = (medicine: any) => {
    setMedicine(medicine);
    setDialogOpenTwo(true);
  };

  const mutation = useMutation(
    async (id: string) => {
      const res = await fetch(`/api/medicine?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Error deleting entry");
        return;
        // throw new Error("Error deleting entry" as string);
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("medicine");
        toast.success("Medicine deleted successfully");
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
            <h1 className="text-2xl">Medicines</h1>
            <Button
              onClick={() => setDialogOpen(true)}
              className={"text-white rounded-md p-6"}
            >
              New Medicine
              <span className="ml-4 text-lg">
                <GoPlus />
              </span>
            </Button>
          </div>
          <Popup
            data={{
              dialogOpen,
              setDialogOpen,
              title: "New Campaign",
              content: (
                <NewMeds
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  load={load}
                  setLoad={setLoad}
                />
              ),
            }}
          />
        </div>

        <div className="py-6 w-full space-y-4 ">
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
                  onValueChange={(e: any) => setStockStatus(e)}
                  defaultValue={stockStatus}
                >
                  <SelectTrigger className="w-[8rem]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className=" shadow-none">
                    <SelectGroup>
                      {/* <SelectLabel>Status</SelectLabel> */}
                      <SelectItem value="all">Status</SelectItem>

                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full min-w-[800px] overflow-y-scroll space-y-4">
            <div className="flex justify-between w-full items-center font-bold text-sm bg-neutral-200/50 dark:bg-neutral-800 p-2 rounded gap-3">
              <h2 className="w-[20%] text-left border-r-[1px] border-black">
                Name
              </h2>
              <h2 className="w-[20%] text-left border-r-[1px] border-black">
                Status
              </h2>
              <h2 className="w-[20%] text-left border-r-[1px] border-black ">
                Instock
              </h2>
              <h2 className="w-[20%] text-left border-r-[1px] border-black">
                Measure
              </h2>
              <h2 className="w-[20%] text-left  border-black">Actions</h2>
            </div>

            <div className="">
              {isLoading ? (
                <Spinner />
              ) : error ? (
                <Error />
              ) : data?.medicines?.length === 0 ? (
                <NoData />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {data?.medicines?.map((item: any) => (
                      <MedicineCard
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
            title: "Edit Medicine",
            content: (
              <EditMeds
                dialogOpen={dialogOpenTwo}
                setDialogOpen={setDialogOpenTwo}
                load={load}
                setLoad={setLoad}
                data={medicine}
              />
            ),
          }}
        />
      </PageContainer>
    </div>
  );
};

export default page;
