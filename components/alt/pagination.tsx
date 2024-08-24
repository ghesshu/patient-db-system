import React from "react";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  prevPage: () => void;
  totalNum: number | string | null;
  goToPage: (page: number) => void;
  nextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  prevPage,
  totalNum,
  goToPage,
  nextPage,
}) => {
  return (
    <div className="flex gap-2 items-center justify-center w-full">
      <Button variant="outline" disabled={page === 1} onClick={prevPage}>
        <IoChevronBack />
      </Button>
      <div className="w-[1rem] border-b-2 border-neutral-200"></div>
      <div className="flex items-center gap-2">
        {[...Array(totalNum)].map((_, index) => (
          <div key={index}>
            <Button
              variant={page === index + 1 ? "default" : "outline"}
              onClick={() => goToPage(index + 1)}
              disabled={page === index + 1}
            >
              {index + 1}
            </Button>
          </div>
        ))}
      </div>
      <div className="w-[1rem] border-b-2 border-neutral-2"></div>

      <Button variant="outline" disabled={page === totalNum} onClick={nextPage}>
        <IoChevronForward />
      </Button>
    </div>
  );
};

export default Pagination;
