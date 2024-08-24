import React from "react";
import Input from "../alt/input-tag";
import { useForm } from "react-formid";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

interface FormValues {
  title: string;
  sendTo: string;
  subject: string;
  message: string;
}

interface CampNewProps {
  dialogOpen?: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  func?: any;
  load: boolean;
  setLoad?: any;
}

const CampNew: React.FC<CampNewProps> = ({
  dialogOpen,
  setDialogOpen,
  func,
  load,
  setLoad,
}) => {
  const { inputs, handleChange, handleSubmit, errors } = useForm<FormValues>({
    defaultValues: {
      title: "",
      sendTo: "All Patients",
      subject: "",
      message: "",
    },
    validation: {
      title: {
        required: true,
      },
      sendTo: {
        required: true,
      },
      subject: {
        required: true,
      },
      message: {
        required: true,
      },
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      const res = await fetch(`/api/campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error creating campaign");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("campaigns");
        toast.success("Campaign created successfully");
        setDialogOpen(false);
      },
      onError: () => {
        toast.error("Error creating campaign", {
          transition: Slide,
        });
      },
      onSettled: () => {
        setLoad(false);
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    setLoad(true);
    mutation.mutate(data);
  };

  return (
    <div className="w-full pt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-1">
        <Input
          label="Campaign Title"
          name="title"
          value={inputs.title}
          onChange={handleChange}
          error={errors.title} // Pass error message for title
          className=""
          placeholder="Enter campaign title"
        />
        <Input
          label="Send To"
          name="sendTo"
          value={inputs.sendTo}
          onChange={handleChange}
          disabled={true}
          error={errors.sendTo} // Pass error message for sendTo
          className=""
        />
        <Input
          label="Subject"
          name="subject"
          value={inputs.subject}
          onChange={handleChange}
          error={errors.subject} // Pass error message for subject
          className=""
          placeholder="Enter subject"
        />
        <Input
          type="textarea"
          label="Message"
          name="message"
          value={inputs.message}
          onChange={handleChange}
          error={errors.message} // Pass error message for message
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
            Discard
          </Button>
          <Button
            disabled={load}
            type="submit"
            className="w-full h-[3.5rem] rounded-md"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CampNew;
