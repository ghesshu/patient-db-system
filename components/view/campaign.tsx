import React from "react";
import Input from "../alt/input-tag";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

interface FormValues {
  _id: string;
  title: string;
  subject: string;
  message: string;
}

interface CampaignEditProps {
  dialogOpen?: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  func?: any;
  load: boolean;
  setLoad?: any;
  values: FormValues;
}

const CampaignEdit: React.FC<CampaignEditProps> = ({
  dialogOpen,
  setDialogOpen,
  func,
  load,
  setLoad,
  values,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      const res = await fetch(`/api/campaign?id=${values._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error deleting campaign");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("campaigns");
        toast.success("Campaign deleted");
        setDialogOpen(false);
      },
      onError: () => {
        toast.error("Error deleting campaign", {
          transition: Slide,
        });
      },
      onSettled: () => {
        setLoad(false);
      },
    }
  );

  const handleDelete = () => {
    setLoad(true);
    mutation.mutate();
  };

  return (
    <div className="w-full pt-6">
      <div className="w-full grid gap-1">
        <Input
          label="Campaign Title"
          name="title"
          value={values.title}
          className=""
          placeholder="Enter campaign title"
        />
        <Input
          label="Send To"
          name="sendTo"
          value="All Patients"
          disabled={true}
          className=""
        />
        <Input
          label="Subject"
          name="subject"
          value={values.subject}
          className=""
          placeholder="Enter subject"
        />
        <Input
          type="textarea"
          label="Message"
          name="message"
          value={values.message}
          className="h-[15rem]"
          placeholder="Enter message"
        />
        <div className="w-full flex flex-col gap-4 md:flex-row pt-4">
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outline"
            className="w-full h-[3.5rem] rounded-md text-red-600 shadow-none"
            type="button"
          >
            Close
          </Button>
          {/* <Button
            onClick={handleDelete}
            disabled={load}
            className="w-full h-[3.5rem] rounded-md bg-red-600"
          >
            Delete
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default CampaignEdit;
