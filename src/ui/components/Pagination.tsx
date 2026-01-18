import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 2) {
      // Near start: show 1 2 3 ... last
      pages.push(2);
      pages.push(3);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Near end: show 1 ... last-2 last-1 last
      pages.push("...");
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
      // Middle: show 1 ... current ... last
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className="flex p-4 items-center justify-between border-t"
      style={{ borderColor: "var(--divider-color)" }}
    >
      <div className="flex-1 flex justify-between items-center">
        <div>
          <p className="text-small" style={{ color: "var(--text-secondary)" }}>
            Showing{" "}
            <span
              className="text-body-medium"
              style={{ color: "var(--text-main)" }}
            >
              {startItem}
            </span>{" "}
            to{" "}
            <span
              className="text-body-medium"
              style={{ color: "var(--text-main)" }}
            >
              {endItem}
            </span>{" "}
            of{" "}
            <span
              className="text-body-medium"
              style={{ color: "var(--text-main)" }}
            >
              {totalItems}
            </span>{" "}
            results
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="icon"
            icon={<ChevronLeft style={{ color: "var(--text-main)" }} />}
          />

          <div className="hidden sm:flex gap-1 items-center">
            {pageNumbers.map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-small"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page as number)}
                  className="px-3 py-1.5 text-small rounded-[8px] transition-colors"
                  style={{
                    backgroundColor:
                      currentPage === page
                        ? "var(--btn-primary-bg)"
                        : "transparent",
                    color:
                      currentPage === page
                        ? "var(--btn-primary-text)"
                        : "var(--text-main)",
                    fontWeight: currentPage === page ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor =
                        "var(--table-row-hover-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Mobile: just show current/total */}
          <div
            className="sm:hidden text-small"
            style={{ color: "var(--text-secondary)" }}
          >
            Page {currentPage} of {totalPages}
          </div>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="icon"
            icon={<ChevronRight style={{ color: "var(--text-main)" }} />}
          />
        </div>
      </div>
    </div>
  );
}
