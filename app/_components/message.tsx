import React from "react";

interface Props {
  fromSender: boolean;
  text: string;
  sentAtTime: string;
}

export const Message = (props: Props) => {
  const { fromSender, sentAtTime, text } = props;

  return (
    <div
      className={`rounded-lg px-2 py-1 w-[65%] ${fromSender ? "bg-white self-start" : "bg-green-400 self-end"} `}
    >
      <span>{text}</span>
      <div className="w-full mt-0.25 flex justify-end">
        <span className="text-xs text-gray-600">{sentAtTime}</span>
      </div>
    </div>
  );
};
