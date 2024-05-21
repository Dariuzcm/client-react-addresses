import { FunctionComponent, ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Meta } from "@/lib/types";

interface PaginatorProps {
  meta: Meta;
}

const Paginator: FunctionComponent<PaginatorProps> = (props) => {
  const { meta } = props;
  const {
    total,
    perPage,
    currentPage,
    lastPage,
    nextPageUrl,
    previousPageUrl,
  } = meta;

  const getPaginationItems = (): ReactNode[] => {
    const nodes = []
    for (let index = 0; index < lastPage; index++) {
      nodes.push(
        <PaginationItem>
            <PaginationLink href="#" isActive={currentPage === (index + 1)}>
              {index + 1}
            </PaginationLink>
        </PaginationItem>
      )
    }
    return nodes
  }
  
  return (
    <>
      <Pagination>
        <PaginationContent>
          {previousPageUrl && (
            <PaginationItem key={'previous'}>
              <PaginationPrevious href="#" />
            </PaginationItem>
          )}
          
          {getPaginationItems()}
          {nextPageUrl && (
            <PaginationItem key={'next'}>
              <PaginationNext href="#" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <div className="flex gap-2 text-xs content-center items-center justify-end w-full">
        <div>
          Registros Totales: <span className="pl-1">{total}</span>
        </div>
        <div className="flex gap-3 items-center">
          <label htmlFor="size">Por página</label>
          <input id="size" className="size-6 text-center" value={perPage} />
        </div>
      </div>
    </>
  );
};

export default Paginator;
