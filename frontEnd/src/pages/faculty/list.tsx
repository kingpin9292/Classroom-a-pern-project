import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useTable } from "@refinedev/react-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

const FacultyList = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");

  const facultyColumns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ row, getValue }) => {
          const name = row.original.name;
          const image = row.original.image;

          return (
            <div>
              <Avatar>
                {image && <AvatarImage src={image} alt={name} />}
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              <span className="text-foreground">{name}</span>
            </div>
          );
        },
      },

      {
        id: "email",
        accessorKey: "email",
        size: 240,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
      },

      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },

      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton resource="users" recordItemId={row.original.id} size="sm" value="outline">
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const searchFilters = searchQuery ? [{ field: "search", operator: "contains" as const, value: searchQuery }] : [];

  const facultyTable = useTable<User>({
    columns: facultyColumns,
    refineCoreProps: {
      resource: "users",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq" as const,
            value: "teacher",
          },
          ...searchFilters,
        ],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Faculty</h1>

      <div className="intro-row">
        <p>Browse and manage faculty members.</p>

        <div className="actions-row">
          <Search className="serach-icon" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      <DataTable table={facultyTable} />
    </ListView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export default FacultyList;
