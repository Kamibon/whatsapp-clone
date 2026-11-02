import React from "react";
import Avatar from "./avatar";
import { clipWords } from "../lib/utils";

interface Props {
  chatName?: string;
  contactName: string;
  lastMessage?: string;
  lastMessageDate?: string;
  onClick: () => void;
  selected?: boolean;
}

export const ChatListElement = (props: Props) => {
  const { chatName, contactName, lastMessage, lastMessageDate, onClick, selected } =
    props;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center hover:bg-gray-300 p-2 w-full"
    >
      <Avatar size="sm" />
      <div className="flex justify-between grow">
        <div className=" flex flex-col  gap-1 pl-2">
          <span className="font-semibold">{chatName ?? contactName}</span>
          <span className=" text-gray-500 text-sm hidden md:block">
            {clipWords(lastMessage, 25)}
          </span>
        </div>
        <span className=" text-sm text-gray-400 hidden lg:block">
          {lastMessageDate}
        </span>
        { selected &&
          <div className="bg-green-500 flex items-center justify-center p-3 rounded-full size-2">
            <span className="text-white">V</span>
          </div>
        }
      </div>
    </div>
  );
};
