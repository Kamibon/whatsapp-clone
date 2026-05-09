import React from "react";

interface Props {
  fromSender: boolean;
  text: string;
  sentAtTime: string;
  seen: boolean;
}

export const Message = (props: Props) => {
  const { fromSender, sentAtTime, seen, text } = props;

  return (
    <div
      className={`rounded-lg px-2 py-1 w-[65%] ${fromSender ? "bg-white self-start" : "bg-green-400 self-end"} `}
    >
      <span className="wrap-break-word">{text}</span>
      <div className="w-full mt-px flex items-center gap-2 justify-end">
        <span className="text-xs text-gray-600">{sentAtTime}</span>
        <span className={`${seen ? "text-blue-600" : "text-gray-500"}`}>
          {seen ? "✓✓" : "✓"}
        </span>
      </div>
    </div>
  );
};
