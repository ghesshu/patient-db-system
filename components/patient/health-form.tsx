import React from "react";
import Input from "../alt/input-tag";
import { useForm } from "react-formid";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

interface FormValues {
  bloodgroup: string;
  weight: string;
  height: string;
  allergies: string;
  habits: string;
  medicalhistory: string;
}

interface HealthFormProps {
  patient: any;
  id: string;
  load: boolean;
  setLoad?: React.Dispatch<React.SetStateAction<boolean>>;
}

const HealthForm: React.FC<HealthFormProps> = ({
  load,
  setLoad,
  id,
  patient,
}) => {
  const { inputs, handleChange, handleSubmit, errors } = useForm<FormValues>({
    defaultValues: {
      bloodgroup: patient.bloodgroup || "",
      weight: patient.weight || "",
      height: patient.height || "",
      allergies: patient.allergies || "",
      habits: patient.habits || "",
      medicalhistory: patient.medicalhistory || "",
    },
    validation: {
      bloodgroup: {
        required: true,
      },
      weight: {
        required: true,
      },
      height: {
        required: true,
      },
      allergies: {
        required: true,
      },
      habits: {
        required: true,
      },
      medicalhistory: {
        required: true,
      },
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      const info = { info: data };
      const res = await fetch(`/api/patient?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (!res.ok) {
        throw new Error("Error updating health details");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient", id]);
        toast.success("Details updated");
        // setDialogOpen(false);
      },
      onError: () => {
        toast.error("Error updating health details", {
          transition: Slide,
        });
      },
      onSettled: () => {
        setLoad?.(false);
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    setLoad?.(true);
    mutation.mutate(data);
  };

  return (
    <div className="w-full pt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-1">
        <Input
          label="Blood Group"
          name="bloodgroup"
          value={inputs.bloodgroup}
          onChange={handleChange}
          error={errors.bloodgroup}
          placeholder="Blood Type..."
          type="select"
          options={[
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ]}
        />

        <Input
          label="Weight"
          name="weight"
          value={inputs.weight}
          onChange={handleChange}
          error={errors.weight}
          placeholder="60kg"
        />
        <Input
          label="Height"
          name="height"
          value={inputs.height}
          onChange={handleChange}
          error={errors.height}
          placeholder="5.5ft"
        />
        <Input
          label="Allergies"
          type="textarea"
          name="allergies"
          value={inputs.allergies}
          onChange={handleChange}
          error={errors.allergies}
          placeholder="beans, nuts, etc"
        />
        <Input
          label="Habits"
          name="habits"
          type="textarea"
          value={inputs.habits}
          onChange={handleChange}
          error={errors.habits}
          placeholder="smoking, drinking, etc"
        />
        <Input
          label="Medical History"
          name="medicalhistory"
          type="textarea"
          value={inputs.medicalhistory}
          onChange={handleChange}
          error={errors.medicalhistory}
          placeholder="diabetes, malaria, glaucoma, etc"
        />
        <div className="w-full flex flex-col gap-4 md:flex-row pt-4">
          <Button
            disabled={load}
            type="submit"
            className="w-full h-[3.5rem] rounded-md"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthForm;
