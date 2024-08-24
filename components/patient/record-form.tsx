"use client";
import React, { useState } from "react";
import Input from "../alt/input-tag";
import { useForm } from "react-formid";
import { Button } from "../ui/button";
import { Slide, toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useSSE } from "@/contexts/SSEContext";
import { Types } from "mongoose"; // Import Types for ObjectId

interface FormValues {
  patient: string;
  complains: string;
  diagnosos: string;
  vitalsigns: string;
  treatment: Types.ObjectId[];
  medicines: MedDoc[];
}

interface MedDoc {
  medicine: Types.ObjectId;
  instruction: string;
  quantity: string;
  dosage: "Morning" | "Afternoon" | "Evening";
}

interface PatientRecordProps {
  id: string;
  load: boolean;
  setLoad?: any;
}

const PatientRecord: React.FC<PatientRecordProps> = ({ load, setLoad, id }) => {
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<MedDoc>>({});
  const [medicines, setMedicines] = useState<MedDoc[]>([]);
  const { data, error } = useSSE();

  const { inputs, handleChange, handleSubmit, errors, setFieldValue } =
    useForm<FormValues>({
      defaultValues: {
        patient: id,
        complains: "",
        diagnosos: "",
        vitalsigns: "",
        treatment: [],
        medicines: [],
      },
      validation: {
        complains: { required: true },
        diagnosos: { required: true },
        vitalsigns: { required: true },
      },
    });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormValues) => {
      const res = await fetch(`/api/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error creating patient record");

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient", id]);
        toast.success("Patient record created successfully");
      },
      onError: () => {
        toast.error("Error creating patient record", { transition: Slide });
      },
      onSettled: () => setLoad(false),
    }
  );

  const onSubmit = (data: FormValues) => {
    setLoad(true);
    mutation.mutate(data);
  };

  const handleAddMedicine = () => {
    const updatedMedicines = [
      ...medicines,
      {
        medicine: newMedicine.medicine!,
        instruction: newMedicine.instruction!,
        quantity: newMedicine.quantity!,
        dosage: newMedicine.dosage! as "Morning" | "Afternoon" | "Evening",
      },
    ];

    setMedicines(updatedMedicines);
    setFieldValue("medicines", updatedMedicines);
    setShowMedicineForm(false);
    setNewMedicine({});
  };

  const handleDeleteMedicine = (index: number) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
    setFieldValue("medicines", newMedicines);
  };

  return (
    <div className="w-full pt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-4">
        <Input
          label="Complain"
          name="complains"
          value={inputs.complains}
          onChange={handleChange}
          error={errors.complains}
          placeholder="Enter patient's complains"
        />

        <Input
          label="Diagnosis"
          name="diagnosos"
          value={inputs.diagnosos}
          onChange={handleChange}
          error={errors.diagnosos}
          placeholder="Enter diagnosos"
        />

        <Input
          label="Vital Signs"
          name="vitalsigns"
          value={inputs.vitalsigns}
          onChange={handleChange}
          error={errors.vitalsigns}
          placeholder="Enter vital signs"
        />

        <div className="flex flex-wrap gap-4">
          <h3 className="text-lg font-semibold">Treatment</h3>
          {data?.treatment?.map((treatment) => (
            <label key={treatment._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={treatment._id}
                onChange={(e) => {
                  const value = e.target.value;
                  const checked = e.target.checked;

                  if (checked) {
                    setFieldValue("treatment", [
                      ...inputs.treatment,
                      new Types.ObjectId(value),
                    ]);
                  } else {
                    setFieldValue(
                      "treatment",
                      inputs.treatment.filter((id) => id.toString() !== value)
                    );
                  }
                }}
                className="text-green-500"
              />
              <span>{treatment.name}</span>
            </label>
          ))}
        </div>

        <div className="w-full pt-4">
          <h3 className="text-lg font-semibold">Medicine</h3>
          <table className="w-full border mt-2">
            <thead className="w-full">
              <tr className="w-full grid grid-cols-5">
                <th className="text-left  border-r-2 p-1">Item</th>
                <th className="text-left  border-r-2 p-1">Instruction</th>
                <th className="text-left  border-r-2 p-1">Quantity</th>
                <th className="text-left  border-r-2 p-1">Dosage</th>
                <th className="text-left  border-r-2 p-1">Actions</th>
              </tr>
            </thead>
            <motion.tbody layout>
              <AnimatePresence>
                {medicines.map((medicine, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full grid grid-cols-5"
                  >
                    <td className="w-full border-r-2 p-1 border-b-2">
                      {
                        data?.medicine.find(
                          (med) => med._id === medicine.medicine.toString()
                        )?.name
                      }
                    </td>
                    <td className="w-full border-r-2 p-1 border-b-2">
                      {medicine.instruction}
                    </td>
                    <td className="w-full border-r-2 p-1 border-b-2">
                      {medicine.quantity}
                    </td>
                    <td className="w-full border-r-2 p-1 border-b-2">
                      {medicine.dosage}
                    </td>
                    <td className="w-full border-r-2 p-1 border-b-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteMedicine(index)}
                        className="text-red-500"
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>

          <button
            type="button"
            onClick={() => setShowMedicineForm(true)}
            className="mt-4 text-green-500 flex items-center space-x-2"
          >
            <AiOutlinePlus />
            <span>Add Medicine</span>
          </button>
        </div>

        <div className="w-full flex flex-col gap-4 md:flex-row pt-4">
          {/* <Button
            variant="outline"
            className="w-full h-[3.5rem] rounded-md text-red-600 shadow-none"
            type="button"
          >
            Discard
          </Button> */}
          <Button
            disabled={load}
            type="submit"
            className="w-full h-[3.5rem] rounded-md"
          >
            Save
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showMedicineForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-[30rem]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Add Medicine</h3>
              <Input
                label="Choose Medicine"
                name="medicine"
                type="select"
                placeholder="Choose"
                options={data?.medicine.map((med: any) => ({
                  label: med.name,
                  value: med._id,
                }))}
                onChange={(e: any) =>
                  setNewMedicine({ ...newMedicine, medicine: e.target.value })
                }
              />
              <Input
                label="Instruction"
                name="instruction"
                placeholder="Instruction"
                onChange={(e: any) =>
                  setNewMedicine({
                    ...newMedicine,
                    instruction: e.target.value,
                  })
                }
              />
              <Input
                label="Quantity"
                name="quantity"
                placeholder="Quantity"
                onChange={(e: any) =>
                  setNewMedicine({ ...newMedicine, quantity: e.target.value })
                }
              />
              <Input
                label="Dosage"
                name="dosage"
                type="select"
                options={[
                  { label: "Morning", value: "Morning" },
                  { label: "Afternoon", value: "Afternoon" },
                  { label: "Evening", value: "Evening" },
                ]}
                onChange={(e: any) =>
                  setNewMedicine({ ...newMedicine, dosage: e.target.value })
                }
              />
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  className="w-[8rem]"
                  onClick={() => setShowMedicineForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddMedicine} className="w-[8rem]">
                  Add
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientRecord;
