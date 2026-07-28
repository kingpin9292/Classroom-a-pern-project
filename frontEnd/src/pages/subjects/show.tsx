import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Department, Subject } from "@/types";
import { useLink, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";
import { useParams } from "react-router";

type SubjectDetails = {
  subject: Subject & {
    department?: Department | null;
  };
  totals: {
    classes: number;
  };
};

type SubjectClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type SubjectUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const SubjectShow = () => {
  const Link = useLink();
  const { id } = useParams();
  const subjectId = id ?? "";

  const { query } = useShow<SubjectDetails>({
    resource: "subjects",
  });

  const details = query.data?.data;

  const classColumns = useMemo<ColumnDef<SubjectClass>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Class</p>,
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
      },
      {
        id: "teacher",
        accessorKey: "teacher",
        size: 220,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ row }) => {
          const teacher = row.original.teacher;
          if (!teacher) {
            return <span className="text-muted-foreground">Unassigned</span>;
          }

          return (
            <div className="flex item-center gap-2">
              <Avatar className="size-7">
                {teacher.image && <AvatarImage src={teacher.image} alt={teacher.name} />}
                <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="truncate">{teacher.name}</span>
                <span className="text-xs text-muted-foreground truncate"></span>
              </div>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return <Badge variant={status === "active" ? "default" : "secondary"}>{status ?? "unknown"}</Badge>;
        },
      },

      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => {
          <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">
            View
          </ShowButton>;
        },
      },
    ],
    [],
  );

  const userColumns = useMemo<ColumnDef<SubjectUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">User</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && <AvatarImage src={row.original.image} alt={row.original.name} />}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
            </div>
          </div>
        ),
      },

      {
        id: "role",
        accessorKey: "role",
        size: 140,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },

      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton resource="users" recordItemId={row.original.id} variant="outline" size="sm">
            View
          </ShowButton>
        ),
      },
    ],

    [],
  );

  const classesTable = useTable<SubjectClass>({
    columns: classColumns,
    refineCoreProps: {
      resource: `subjects/${subjectId}/classes`,
      pagination: {
        pageSize: 10,
        mode: "server",
      },
    },
  });

  const teachersTable = useTable<SubjectUser>({
    columns: userColumns,
    refineCoreProps: {
      resource: `/subjects/${subjectId}/users`,
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "teacher",
          },
        ],
      },
    },
  });

  const studentsTable = useTable<SubjectUser>({
    columns: userColumns,
    refineCoreProps: {
      resource: `subjects/${subjectId}/users`,
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [{ field: "role", operator: "eq", value: "student" }],
      },
    },
  });
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};
