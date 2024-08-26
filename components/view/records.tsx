import React from "react";
import { Button } from "../ui/button";

interface MedDoc {
  medicine: string;
  instruction: string;
  quantity: string;
}

interface PatientRecordProps {
  data: {
    complains: string;
    diagnosos: string;
    vitalsigns: string;
    treatment: { _id: string; name: string }[];
    medicine: MedDoc[];
  };
  dialogOpen?: any;
  setDialogOpen?: any;
}

const RecordView: React.FC<PatientRecordProps> = ({
  data,
  setDialogOpen,
  dialogOpen,
}) => {
  return (
    <div className="w-full pt-6">
      <div className="w-full grid gap-4">
        <div>
          <label className="block text-sm font-medium">Complain</label>
          <p>{data.complains}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Diagnosis</label>
          <p>{data.diagnosos}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Vital Signs</label>
          <p>{data.vitalsigns}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <h3 className="text-lg font-semibold">Treatment</h3>
          {data.treatment.map((treatment) => (
            <div key={treatment._id} className="flex items-center space-x-2">
              <span>{treatment.name}</span>
            </div>
          ))}
        </div>

        <div className="w-full pt-4">
          <h3 className="text-lg font-semibold">Medicine</h3>
          <table className="w-full border mt-2">
            <thead className="w-full">
              <tr className="w-full grid grid-cols-3">
                <th className="text-left border-r-2 p-1">Item</th>
                <th className="text-left border-r-2 p-1">Instruction</th>
                <th className="text-left p-1">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data?.medicine?.map((medicine: any, index: number) => (
                <tr key={index} className="w-full grid grid-cols-3">
                  <td className="w-full border-r-2 p-1 border-b-2">
                    {medicine.medicine}
                  </td>
                  <td className="w-full border-r-2 p-1 border-b-2">
                    {medicine.instruction}
                  </td>
                  <td className="w-full p-1 border-b-2">{medicine.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
          disabled={load}
          type="submit"
          className="w-full h-[3.5rem] rounded-md"
        >
          Save
        </Button> */}
      </div>
    </div>
  );
};

export default RecordView;
