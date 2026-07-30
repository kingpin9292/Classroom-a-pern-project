import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "react-day-picker";

type DepartmentListItem = {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  totalSubjects?: number | null;
};

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const departmentColumns = useMemo<ColumnDef<DepartmentListItem>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 120,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => {
          const code = getValue<string>();

          return code ? <Badge>{code}</Badge> : <span className="text-muted-foreground">No code</span>;
        },
      },

      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
      },

      {
        id: "totalSubjects",
        accessorKey: "totalSubjects",
        size: 160,
        header: () => <p className="column-title">Subjects</p>,
        cell: ({ getValue }) => {
          const total = getValue<number>();
          return <Badge variant="secondary">{total ?? 0}</Badge>;
        },
      },

      {
        id: "description",
        accessorKey: "description",
        size: 320,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => {
          const description = getValue<string>();

          return description ? (
            <span className="truncate line-clamp-2">{description}</span>
          ) : (
            <span className="text-muted-foreground">No description</span>
          );
        },
      },

      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm">
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: "searchQuery",
        },
        {
          field: "code",
          operator: "contains" as const,
          value: "searchQuery",
        },
      ]
    : [];

  const departmentTable = useTable<DepartmentListItem>({
    columns: departmentColumns,
    refineCoreProps: {
      resource: "departments",
      Pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or code..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <CreateButton resource="departments" />
        </div>
      </div>
      <DataTable table={departmentTable} />
    </ListView>
  );
};
export default DepartmentsList;
