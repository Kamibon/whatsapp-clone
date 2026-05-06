import { prisma } from "@/app/lib/prisma";
import redis from "@/app/lib/redis";
import { withMetrics } from "@/app/lib/withMetrics";

const findMessagesByChatId = async (request: Request, { params }) => {
  const { id } = await params;

  const cachedMessages = await redis.get(`messages:${id}`);

  if (cachedMessages) {
    console.log("cacheee");
    return new Response(cachedMessages, { status: 200 });
  }

  const messages = await prisma.message.findMany({
    where: { chatId: id },
    include: {
      sender: true,
      attachments: true,
      readReceipts: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  await redis.set(`messages:${id}`, JSON.stringify(messages), "EX", 60 * 60);

  return Response.json(messages);
};

const addMessageToChat = async (request: Request, { params }) => {
  const { id } = await params;

  const body = await request.json();

  try {
    const newMessage = await prisma.message.create({
      data: {
        chatId: id,
        senderId: body.senderId,
        content: body.content,
      },
    });

    await redis.del(`messages:${id}`);

    return Response.json(newMessage);
  } catch (error) {
    return Response.json(error.message, { status: 500 });
  }
};

export const GET = withMetrics(findMessagesByChatId, "/api/chats/messages/id");
export const POST = withMetrics(addMessageToChat, "/api/chats/messages");
