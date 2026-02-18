import { prisma } from "@/app/lib/prisma";
import { withMetrics } from "@/app/lib/withMetrics";

const createChat = async (request: Request) => {
  const body = await request.json();

  const existingChat = await prisma.chat.findFirst({
    where: {
      type: "PRIVATE",
      AND: [
        { participants: { some: { userId: body.userId1 } } },
        { participants: { some: { userId: body.userId2 } } },
      ],
    },
  });

  if (existingChat)
    return Response.json({
      message: "Chat already exists",
      chat: existingChat,
    });

  try {
    const newChat = await prisma.chat.create({
      data: {
        type: "PRIVATE",
        participants: {
          create: [{ userId: body.userId1 }, { userId: body.userId2 }],
        },
      },
    });

    return Response.json(
      { message: "Chat created", chat: newChat },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(error.message, { status: 500 });
  }
};

export const POST = withMetrics(createChat, "/api/chat");
