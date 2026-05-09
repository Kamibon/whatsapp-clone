import { prisma } from "@/app/lib/prisma";
import { withMetrics } from "@/app/lib/withMetrics";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

const findAllUsers = async (req: Request) => {
  const users = await prisma.user.findMany();

  return Response.json(users);
};

const createUser = async (req: Request) => {
  const body = await req.json();

  const hashed = await bcrypt.hash(body.password, 10);

  try {
    await prisma.user.create({
      data: {
        username: body.username,
        password: hashed,
        displayName: body.displayName,
        phoneNumber: body.phoneNumber,
        avatarUrl: body.avatarUrl || null,
      },
    });
  } catch (error) {
    return Response.json({ error: error!.message }, { status: 500 });
  }
  return Response.json("User created", { status: 201 });
};
export const GET = withMetrics(findAllUsers, "/api/users");
export const POST = withMetrics(createUser, "/api/users");
