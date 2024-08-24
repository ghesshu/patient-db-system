import React from "react";
import Input from "../alt/input-tag";
import { useForm } from "react-formid";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

interface FormValues {
  name: string;
  description: string;
}

interface NewTreatmentProps {
  dialogOpen?: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  func?: any;
  load: boolean;
  setLoad?: any;
}

const NewTreatment: React.FC<NewTreatmentProps> = ({
  dialogOpen,
  setDialogOpen,
  func,
  load,
  setLoad,
}) => {
  const { inputs, handleChange, handleSubmit, errors } = useForm<FormValues>({
    defaultValues: {
      name: "",

      description: "",
    },
    validation: {
      name: {
        required: true,
      },

      description: {
        required: true,
      },
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      const res = await fetch(`/api/treatment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error creating entry");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("treatment");
        toast.success("Treatment created successfully");
        setDialogOpen(false);
      },
      onError: () => {
        toast.error("Error creating entry", {
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
          label="Name"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          error={errors.name}
          className=""
          placeholder="Enter name"
        />

        <Input
          type="textarea"
          label="Description"
          name="description"
          value={inputs.description}
          onChange={handleChange}
          error={errors.description}
          className="h-[15rem]"
          placeholder="Enter description"
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

export default NewTreatment;
