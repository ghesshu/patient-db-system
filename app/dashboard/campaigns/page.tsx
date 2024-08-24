"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { useQuery } from "react-query";

import CampNew from "@/components/new/new-camp";
import Popup from "@/components/alt/popup";
import { SubmitHandler } from "react-hook-form";
import { useSidebar } from "@/hooks/useSidebar";
import { RiMore2Line } from "react-icons/ri";
import { GoMail } from "react-icons/go";

import { fetchCampaigns } from "@/lib/api";
import Error from "@/components/alt/error";
import Spinner from "@/components/alt/spinner";
import NoData from "@/components/alt/nodata";
import CampaignEdit from "@/components/view/campaign";

interface FormValues {
  title: string;
  sendTo: string;
  subject: string;
  message: string;
}

interface Campaign {
  _id: string;
  title: string;
  subject: string;
  message: string;
  createdAt: string;
  daysAgo: number;
}

const Page = () => {
  const { isMinimized } = useSidebar();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenTwo, setDialogOpenTwo] = React.useState(false);
  const [load, setLoad] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const { data, isLoading, error } = useQuery("campaigns", fetchCampaigns);

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const selectCampaign = (campaign: Campaign) => {
    setCampaign(campaign);
    setDialogOpenTwo(true);
  };

  return (
    <div>
      <PageContainer scrollable={true}>
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl">Campaigns</h1>
            <Button
              onClick={() => setDialogOpen(true)}
              className={"text-white rounded-md p-6"}
            >
              New Campaign
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
                <CampNew
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  load={load}
                  setLoad={setLoad}
                />
              ),
              func: handleFormSubmit,
            }}
          />
        </div>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Error />
        ) : data.campaigns.length === 0 ? (
          <NoData />
        ) : (
          <div
            className={`${
              isMinimized
                ? "lg:grid-cols-3 2xl:grid-cols-4"
                : "lg:grid-cols-2  2xl:grid-cols-3"
            } w-full my-8 grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3`}
          >
            {data.campaigns.map((campaign: Campaign) => (
              <div
                key={campaign._id}
                className="w-full bg-white dark:bg-neutral-900 h-[16rem] rounded-lg shadow-sm p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center border-b pb-4 flex-shrink-0">
                  <div className="flex gap-2 items-center">
                    <h2 className="text-primary bg-primary/20 h-[3rem] w-[3rem] rounded-[6px] text-xl flex items-center justify-center ">
                      <GoMail />
                    </h2>
                    <div className="flex flex-col justify-between text-xs gap-1">
                      <h2 className="text-sm">
                        {campaign.title.length > 25
                          ? campaign.title.slice(0, 25) + "..."
                          : campaign.title}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => selectCampaign(campaign)}
                    className="text-xl h-[2rem] w-[2rem] flex items-center justify-center hover:text-primary"
                  >
                    <RiMore2Line />
                  </button>
                  <Popup
                    data={{
                      dialogOpen: dialogOpenTwo,
                      setDialogOpen: setDialogOpenTwo,
                      title: "View Campaign",
                      content: (
                        <CampaignEdit
                          dialogOpen={dialogOpenTwo}
                          setDialogOpen={setDialogOpenTwo}
                          load={load}
                          setLoad={setLoad}
                          values={campaign}
                        />
                      ),
                      func: handleFormSubmit,
                    }}
                  />
                </div>
                <div className="flex-grow h-full space-y-2 flex flex-col justify-between pt-4 text-sm">
                  <h2 className="font-bold">Message</h2>
                  <p className="text-neutral-400 text-xs">
                    {campaign.message.length > 150
                      ? campaign.message.slice(0, 150) + "..."
                      : campaign.message}
                  </p>
                  <h3 className="bg-neutral-200 dark:bg-neutral-600 py-2 w-[7rem] text-center text-neutral-400 rounded-sm">
                    {campaign.daysAgo} Days ago
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Page;
