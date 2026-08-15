import { ShowView } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router";

type EnrollmentDetails = {
  id: number;
  class?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
};

const EnrollmentConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const enrollment = (location.state as { enrollment?: EnrollmentDetails })?.enrollment;
  if (!enrollment) {
    return (
      <ShowView className="class-view">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground "> No enrollment details found.</p>
            <Button className="mt-4" onClick={() => navigate("/classes")}>
              Browse Classes
            </Button>
          </CardContent>
        </Card>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Confirmed</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">You have been enrolled successfully.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {enrollment.department && <Badge variant="secondary">{enrollment.department.name}</Badge>}
            {enrollment.subject && <Badge>{enrollment.subject?.name}</Badge>}
            {enrollment.class && <Badge>{enrollment.class?.name}</Badge>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Class</p>
            <p className="text-base font-semibold">{enrollment.class?.name ?? "Unknown"}</p>
          </div>
          <Separator />
          <div className="mb-4">
            <p className="text-sm text-muted-foreground my-2">Teacher</p>
            <p className="text-base font-semibold">{enrollment.teacher?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{enrollment.teacher?.email ?? "No email"}</p>
          </div>
          <Separator />

          <div className="flex gap-2 mt-2">
            <Button onClick={() => navigate("/classes")}>View Classes</Button>
            {enrollment.class?.id && (
              <Button onClick={() => navigate(`/classes/show/${enrollment.class?.id}`)}>Go to class</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default EnrollmentConfirm;
