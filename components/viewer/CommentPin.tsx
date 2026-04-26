"use client";

interface CommentPinProps {
  x: number;
  y: number;
  index: number;
  isActive: boolean;
  isResolved: boolean;
  commentCount: number;
  onClick: () => void;
}

export default function CommentPin({
  x,
  y,
  index,
  isActive,
  isResolved,
  onClick,
}: CommentPinProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
      }}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-lg transition-all hover:scale-110 ${
        isActive
          ? "bg-blue-500 border-white text-white scale-110 ring-2 ring-blue-400"
          : isResolved
          ? "bg-gray-600 border-gray-400 text-gray-300"
          : "bg-blue-600 border-white text-white hover:bg-blue-500"
      }`}
      title={`コメント #${index}`}
    >
      {index}
    </button>
  );
}
