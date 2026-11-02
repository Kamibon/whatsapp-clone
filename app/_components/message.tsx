import React from "react";

interface Props {
  senderName?: string;
  fromSender: boolean;
  text: string;
  sentAtTime: string;
  seen: boolean;
}

export const Message = (props: Props) => {
  const { fromSender, senderName, sentAtTime, seen, text } = props;

  return (
    <div
      className={`rounded-lg px-2 py-1 w-[65%] ${fromSender ? "bg-white self-start" : "bg-green-400 self-end"} `}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-blue-400">{senderName}</span>
        <span className="wrap-break-word">{text}</span>
      </div>
      <div className="w-full mt-px flex items-center gap-2 justify-end">
        <span className="text-xs text-gray-600">{sentAtTime}</span>
        <span className={`${seen ? "text-blue-600" : "text-gray-500"}`}>
          {seen ? "✓✓" : "✓"}
        </span>
      </div>
    </div>
  );
};
