import { prisma } from "@/app/lib/prisma";
import { withMetrics } from "@/app/lib/withMetrics";
import { ParamsWithId } from "@/app/types/interfaces";

const findUserById = async (req: Request,  { params }: ParamsWithId) => {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id: id } });

  if (!user) return Response.json("User not found", { status: 404 });

  const { password, ...userResponse } = user;

  return Response.json(userResponse);
};

const deleteUser = async (req: Request, { params }: ParamsWithId) => {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: id } });

  if (!user) return Response.json("User not found", { status: 404 });

  try {
    await prisma.user.delete({ where: { id: id } });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }

  return Response.json("User deleted", { status: 200 });
};

const editUser = async (req: Request, { params }: ParamsWithId) => {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: id } });
  const body = await req.json();

  if (!user) return Response.json("User not found", { status: 404 });

  try {
    await prisma.user.update({ where: { id: id }, data: body });
  } catch (error) {
    return Response.json("Failed to update", { status: 500 });
  }
};

export const GET = withMetrics(findUserById, "/api/users/[id]");

export const DELETE = withMetrics(deleteUser, "/api/users/[id]");

export const PUT = withMetrics(editUser, "/api/users/[id]");
