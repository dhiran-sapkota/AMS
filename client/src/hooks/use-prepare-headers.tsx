import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export const usePrepareHeaders = (headerDetails: { title: string; value?: string }[]) => {
  const [sortingInfo, setSortingInfo] = useState<{
    order: "desc" | "asc" | null;
    order_by: string | null ;
  }>({
    order: null,
    order_by: null,
  });

  const headers = headerDetails.map(header =>
    header.value
      ?
      <div key={header.value} className="flex items-center">
        <div className=" mr-2"> {header.title} </div>
        <ArrowUp
          onClick={() => {
            if (sortingInfo.order === "asc" && sortingInfo.order_by === header.value) {
              setSortingInfo({ order: null, order_by: null });
            } else {
              setSortingInfo({ order: "asc", order_by: header?.value ?? ""  });
            }
          }}
          className={`h-4 cursor-pointer w-4 ${sortingInfo.order === "asc" && sortingInfo.order_by === header.value && "text-black"} `}
        />
        <ArrowDown
          onClick={() => {
            if (sortingInfo.order === "desc" && sortingInfo.order_by === header.value) {
              setSortingInfo({ order: null, order_by: null });
            } else {
              setSortingInfo({ order: "desc", order_by: header.value ?? "" });
            }
          }}
          className={`h-4 cursor-pointer w-4 ${sortingInfo.order === "desc" && sortingInfo.order_by === header.value && "text-black"} `}
        />
      </div>
      :
      <span key={header.title}>{header.title}</span>
  )

  return {sortingInfo, headers}

};
