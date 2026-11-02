import { prisma } from "@/app/lib/prisma";
import { withMetrics } from "@/app/lib/withMetrics";
import { CreateChatRequest } from "@/app/types/interfaces";

const createChat = async (request: Request) => {
  try {
    const body = (await request.json()) as Partial<CreateChatRequest>;
    const { participants, name } = body;

    if (!Array.isArray(participants) || participants.length < 2) {
      return Response.json(
        { message: "At least two valid participants are required" },
        { status: 400 },
      );
    }

    const uniqueIds = [...new Set(participants)];

    if (uniqueIds.length !== participants.length) {
      return Response.json(
        { message: "Duplicate participants are not allowed" },
        { status: 400 },
      );
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== uniqueIds.length) {
      return Response.json(
        { message: "One or more participants do not exist" },
        { status: 400 },
      );
    }

    const chatType: "PRIVATE" | "GROUP" =
      uniqueIds.length === 2 ? "PRIVATE" : "GROUP";

    if (chatType === "PRIVATE") {
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: "PRIVATE",
          AND: uniqueIds.map((userId) => ({
            participants: {
              some: { userId },
            },
          })),
        },
        include: {
          participants: true,
        },
      });

      if (existingChat) {
        return Response.json({
          message: "Chat already exists",
          chat: existingChat,
        });
      }
    }

    if (!name)
      return Response.json(
        { message: "Group chat must have a name" },
        { status: 400 },
      );

    const newChat = await prisma.chat.create({
      data: {
        type: chatType,
        name: name, 
        participants: {
          create: uniqueIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    return Response.json(
      {
        message: "Chat created",
        chat: newChat,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error creating chat:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const POST = withMetrics(createChat, "/api/chat");
