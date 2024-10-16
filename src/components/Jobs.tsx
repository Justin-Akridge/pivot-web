import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
// import { useAppContext } from "@/context/AppContext";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreateJobForm } from "./CreateJobForm";
import { useJobContext } from "@/context/JobContext";

export type Job = {
  id: string
  jobName: string
  client_name: string
  updated_at: string
}

export function Jobs() {
  const [openCreateJobForm, setOpenCreateJobForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const [data, setJobs ] = useState<Job[]>([])
  const { setSelectedJob } = useJobContext();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/job`, {
      method: "GET"
    }).then(response => {
      if (!response) {
        throw new Error("Fetching jobs response was not okay!");
      }
      return response.json(); 
    }).then(data => {
      setJobs(data);
    }).catch(e => {
      console.error(e);
    })
  },[])

  function handleJobSelected(job: Job) {
    localStorage.setItem('selectedJob', JSON.stringify(job));
    setSelectedJob(job)
    navigate(`/${job.id}`);
  }

  console.log(data)
  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "jobName",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("jobName")}</div>
      ),
    },
    {
      accessorKey: "companyName",
      header: () => <div className="">Client</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="">Timestamp</div>,
      cell: ({ row }) => {
        const timestamp = row.getValue("createdAt");
        let formattedDate = 'Invalid date';
        if (typeof timestamp === 'string' && timestamp.trim()) {
          const date = new Date(timestamp);
          if (!isNaN(date.getTime())) {
            formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              timeZoneName: 'short'
            }).format(date);
          }
        }

        return <div className="font-medium">{formattedDate}</div>;
      }
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex h-full w-full flex-col p-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Job Board</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 pt-4 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
        </nav>
        <div className="grid gap-6">
    <div className="px-4 py-4 w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search jobs..."
          value={(table.getColumn("jobName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-9"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="h-8 w-fit p-3" onClick={() => setOpenCreateJobForm(true)}>Create job</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => handleJobSelected(row.original)}
                  key={row.id}
                  className='cursor-pointer h-4'
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {openCreateJobForm && ( <CreateJobForm toggleJobModal={setOpenCreateJobForm} setJobs={setJobs} />)}
    </div>
    </div>
        </div>
      </div>

  )
}