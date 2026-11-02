import { prisma } from "@/app/lib/prisma";
import { withMetrics } from "@/app/lib/withMetrics";
import { ParamsWithId } from "@/app/types/interfaces";

const findAllChatsByUserId = async (req: Request, { params }: ParamsWithId) => {
  const { id } = await params;

  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId: id,
        },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      participants: {
        include: { user: true },
      }
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.json(chats);
};

export const GET = withMetrics(findAllChatsByUserId, "/api/chats/[id]");
