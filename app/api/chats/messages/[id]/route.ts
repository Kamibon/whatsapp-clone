import { prisma } from "@/app/lib/prisma";
import redis from "@/app/lib/redis";
import { withMetrics } from "@/app/lib/withMetrics";

interface ParamsProps {
  params: { id: string };
}

const findMessagesByChatId = async (
  request: Request,
  { params }: ParamsProps,
) => {
  const { id } = await params;

  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1); // pagina minima = 1
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") || "20", 10), 1),
    20,
  );

  const offset = (page - 1) * limit;

  const stream = redis.scanStream({
    match: `messages:${id}:*`,
  });

  stream.on("data", async (keys) => {
    if (keys.length) {
      await redis.del(keys);
    }
  });

  const cacheKey = `messages:${id}:page:${page}:limit:${limit}`;
  const cachedMessages = await redis.get(cacheKey);

  if (cachedMessages && page > 1) {
    return new Response(cachedMessages, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = await prisma.message.findMany({
    where: { chatId: id },
    include: {
      sender: true,
      attachments: true,
      readReceipts: true,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  if (page > 1) {
    await redis.set(cacheKey, JSON.stringify(messages), "EX", 3600);
  }

  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const addMessageToChat = async (request: Request, { params }: ParamsProps) => {
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

    return Response.json(newMessage);
  } catch (error) {
    return Response.json(error.message, { status: 500 });
  }
};

export const GET = withMetrics(findMessagesByChatId, "/api/chats/messages/id");
export const POST = withMetrics(addMessageToChat, "/api/chats/messages");
