import { ReactNode } from "react";
import { Chat, MessageType } from "../types/interfaces";
import React from "react";
import { Message } from "../_components/message";
import { isDifferentDay } from "../lib/utils";
import { useAuth } from "./useAuth";

export const useGenerateMessages = (
  messages: MessageType[],
  currentChat: Chat,
) => {
  const { userId } = useAuth();

  const temp = messages.slice()

  const component: ReactNode = currentChat ? (
    <>
      {!messages.length && (
        <div className="rounded-lg bg-amber-200 px-1 py-2 text-center text-xs">
          Inizia una conversazione
        </div>
      )}
      {temp.map((item, index) => (
        <React.Fragment key={item.id}>
          {((messages[index - 1] &&
            isDifferentDay(
              new Date(messages[index - 1].createdAt),
              new Date(messages[index].createdAt),
            )) ||
            !messages[index - 1]) && (
            <div className="  flex items-center justify-center">
              <div className="rounded-xl bg-blue-300 text-center px-1 py-2 text-blue-500">
                {new Date(messages[index].createdAt).toLocaleDateString(
                  "it-IT",
                )}
              </div>
            </div>
          )}
          <Message
            fromSender={item.senderId !== userId}
            text={item.content}
            sentAtTime={`${new Date(item.createdAt).getHours().toString()}: 
                        ${new Date(item.createdAt).getMinutes().toString().padStart(2, "0")} `}
            seen={item.readReceipts.some(
              (receipt) =>
                receipt.userId ===
                currentChat?.participants.filter((p) => p.userId !== userId)[0]
                  .userId,
            )}
          />
        </React.Fragment>
      ))}
    </>
  ) : (
    <></>
  );

  return { component };
};
