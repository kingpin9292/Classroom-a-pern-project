import { BACKEND_BASE_URL, USER_ROLES } from "@/constants";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}auth`,
  user: {
    additionalFields: {
      role: {
        type: USER_ROLES,
        required: true,
        defaultValue: "student",
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      iamgeCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
