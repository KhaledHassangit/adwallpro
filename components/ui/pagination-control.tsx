"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useI18n } from "@/providers/LanguageProvider";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlProps) {
    const { t, lang } = useI18n();
    const isRTL = lang === "ar";

    // Don't render if there's only 1 page or less
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("ellipsis-start");
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("ellipsis-end");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                    <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            return (
                <PaginationItem key={page}>
                    <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => onPageChange(page as number)}
                        className="cursor-pointer"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                            }`}
                        // Handle RTL for Previous button
                        style={{ direction: isRTL ? "rtl" : "ltr" }}
                    />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        className={`cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                            }`}
                        // Handle RTL for Next button
                        style={{ direction: isRTL ? "rtl" : "ltr" }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
