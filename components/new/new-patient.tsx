"use client";
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

interface NewPatientProps {
  func?: any;
  load?: boolean;
  setLoad?: any;
  router: any;
}

const NewPatient: React.FC<NewPatientProps> = ({ load, setLoad, router }) => {
  const { inputs, handleChange, handleSubmit, errors } = useForm<FormValues>({
    defaultValues: {
      fullname: "",
      phonenumber: "",
      email: "",
      gender: "",
      emergency: "",
      dob: "",
      address: "",
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
        validate: (value: string) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) ||
          "Invalid email format",
      },
      gender: {
        required: true,
      },
      emergency: {
        required: true,
      },
      dob: {
        required: true,
      },
      address: {
        required: true,
      },
    },
  });
  const defaultFromDate = "2000-01-01";
  const defaultToDate = new Date().toISOString().split("T")[0];
  const dateRange = `${defaultFromDate} - ${defaultToDate}`;

  const gender = "all";
  const sort = "newest";
  const page = 1;
  const limit = "10";
  const search = "";

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      console.log(data);
      const res = await fetch(`/api/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error creating patient");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "patients",
          gender,
          dateRange,
          sort,
          page,
          limit,
          search,
        ]);
        toast.success("Patient created successfully");
        router.back();
      },
      onError: () => {
        toast.error("Error creating patient", {
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
    <div className="w-full p-6 bg-white mt-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full grid gap-4 lg:grid-cols-2 ">
          {/* Input Fields */}
          <Input
            label="Full Name"
            name="fullname"
            value={inputs.fullname}
            onChange={handleChange}
            error={errors.fullname}
            placeholder="Enter full name"
          />
          <Input
            label="Phone Number"
            name="phonenumber"
            value={inputs.phonenumber}
            onChange={handleChange}
            error={errors.phonenumber}
            placeholder="Enter phone number"
          />
          <Input
            label="Email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email"
          />
          <Input
            label="Gender"
            name="gender"
            type="select"
            placeholder="Gender"
            value={inputs.gender}
            onChange={handleChange}
            error={errors.gender}
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
            placeholder="Enter emergency contact"
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
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
            placeholder="Enter address"
          />
        </div>
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4 md:flex-row pt-4">
          {/* <Button
            // onClick={() => setDialogOpen(false)}
            variant="outline"
            className="w-full h-[3.5rem] rounded-md text-red-600 shadow-none"
            type="button"
          >
            Cancel
          </Button> */}
          <Button
            disabled={load}
            type="submit"
            className="w-full h-[3.5rem] rounded-md"
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPatient;
