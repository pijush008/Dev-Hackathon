"use client";

import { useState, useMemo, useCallback } from "react";

interface UseTableOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  defaultSortKey?: keyof T;
  defaultSortDir?: "asc" | "desc";
  pageSize?: number;
}

interface UseTableReturn<T> {
  search: string;
  setSearch: (s: string) => void;
  sortKey: keyof T | null;
  sortDir: "asc" | "desc";
  toggleSort: (key: keyof T) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  filteredData: T[];
  paginatedData: T[];
  totalPages: number;
  totalItems: number;
}

export function useTable<T>({
  data,
  searchKeys,
  defaultSortKey,
  defaultSortDir = "asc",
  pageSize: initialPageSize = 10,
}: UseTableOptions<T>): UseTableReturn<T> {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const toggleSort = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey],
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key];
          if (val == null) return false;
          return String(val).toLowerCase().includes(q);
        }),
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  return {
    search,
    setSearch,
    sortKey,
    sortDir,
    toggleSort,
    page,
    setPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    pageSize,
    setPageSize: (s: number) => {
      setPageSize(s);
      setPage(1);
    },
    filteredData,
    paginatedData,
    totalPages,
    totalItems: filteredData.length,
  };
}
