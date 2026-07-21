import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { boolean } from "zod";
import { AdvancedImage } from "@cloudinary/react";
// import { bannerPhoto } from "@/lib/cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const ClassesShow = () => {
  const { query } = useShow<ClassDetails>({
    resource: "classes",
  });

  const classDetails = query.data?.data;

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading Class details..."
            : query.isError
            ? "Failed to load class details"
            : "Class details not found"}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class details" />

      <Card className="details-card">
        {/*class details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div>
              <Badge variant="outline">{classDetails.capacity} spots</Badge>
              <Badge
                variant={classDetails.status === "active" ? "default" : "secondary"}
                data-status={classDetails.status}
              >
                {classDetails?.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img src={classDetails.teacher?.image ?? placeholderUrl} alt={teacherName} />
              </div>
            </div>
          </div>

          <div className="department pt-6">
            <p>🏛️ Departments</p>
            <div>
              <p>{classDetails?.department?.name}</p>
              <p>{classDetails?.department?.description}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/*subject card*/}
        <div className="subject">
          <p>📚 Subject</p>
          <div>
            <Badge variant="outline">
              Code:<span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>

      <Card className="hover:shadow-md trasnition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>{/* <DataTable table={} paginationVariant="simple" /> */}</CardContent>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
