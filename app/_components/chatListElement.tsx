import React from "react";
import Avatar from "./avatar";
import { clipWords } from "../lib/utils";

interface Props {
  contactName: string;
  lastMessage?: string;
  lastMessageDate?: string;
  onClick: () => void;
}

export const ChatListElement = (props: Props) => {
  const { contactName, lastMessage, lastMessageDate, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center hover:bg-gray-300 p-2 w-full"
    >
      <Avatar size="sm" />
      <div className="flex justify-between grow">
        <div className=" flex flex-col  gap-1 pl-2">
          <span className="font-semibold">{contactName}</span>
          <span className=" text-gray-500 text-sm hidden md:block">
            {clipWords(lastMessage, 25)}
          </span>
        </div>
        <span className=" text-sm text-gray-400 hidden lg:block">
          {lastMessageDate}
        </span>
      </div>
    </div>
  );
};
