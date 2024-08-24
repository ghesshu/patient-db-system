import React from "react";
import Input from "../alt/input-tag";
import { useForm } from "react-formid";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

interface FormValues {
  fullname: string;
  phonenumber: string;
  email: string;
  gender: string;
  emergency: string;
  dob: string;
  address: string;
}

interface HealthFormProps {
  patient: any;
  id: string;
  load: boolean;
  setLoad?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientForm: React.FC<HealthFormProps> = ({
  load,
  setLoad,
  id,
  patient,
}) => {
  const { inputs, handleChange, handleSubmit, errors } = useForm<FormValues>({
    defaultValues: {
      fullname: patient?.fullname || "",
      phonenumber: patient?.phonenumber || "",
      email: patient?.email || "",
      gender: patient?.gender || "",
      emergency: patient?.emergency || "",
      dob: patient?.dob || "",
      address: patient?.address || "",
    },
    validation: {
      fullname: {
        required: true,
      },
      phonenumber: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      gender: {
        required: true,
      },
      emergency: {
        required: true,
      },
      dob: {
        required: true,
        date: true,
      },
      address: {
        required: true,
      },
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      const res = await fetch(`/api/patient?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
          label="Full Name"
          name="fullname"
          value={inputs.fullname}
          onChange={handleChange}
          error={errors.fullname}
          placeholder="Full Name"
        />
        <Input
          label="Phone Number"
          name="phonenumber"
          value={inputs.phonenumber}
          onChange={handleChange}
          error={errors.phonenumber}
          placeholder="Phone Number"
        />
        <Input
          label="Email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Email"
        />
        <Input
          label="Gender"
          name="gender"
          value={inputs.gender}
          onChange={handleChange}
          error={errors.gender}
          placeholder="Gender"
          type="select"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <Input
          label="Emergency Contact"
          name="emergency"
          value={inputs.emergency}
          onChange={handleChange}
          error={errors.emergency}
          placeholder="Emergency Contact"
        />
        <Input
          label="Date of Birth"
          name="dob"
          value={inputs.dob}
          onChange={handleChange}
          error={errors.dob}
          placeholder="MM/DD/YYYY"
        />
        <Input
          label="Address"
          name="address"
          value={inputs.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Address"
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

export default PatientForm;
