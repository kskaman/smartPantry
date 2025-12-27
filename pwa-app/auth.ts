import { auth as authMiddleware } from "@/app/api/auth/[...nextauth]/route";

export const auth = authMiddleware;
