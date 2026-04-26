"use client";

import { useRef, useState } from "react";

interface Props {
  flowName: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onAddStory: () => void;
  onDeleteFlow: () => void;
  onRename: (name: string) => void;
}

export default function FlowToolbar({ flowName, dirty, saving, onSave, onAddStory, onDeleteFlow, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(flowName);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(flowName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== flowName) {
      onRename(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900 px-4 py-2 flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onAddStory}
        className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
      >
        + Story を追加
      </button>

      <div className="flex-1 flex justify-center">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-blue-500 w-64 text-center"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="text-sm font-medium text-gray-200 hover:text-white px-2 py-0.5 rounded hover:bg-gray-800 transition-colors"
          >
            {flowName}
          </button>
        )}
      </div>

      {dirty && !saving && (
        <span className="text-xs text-yellow-500">未保存の変更</span>
      )}
      {saving && <span className="text-xs text-gray-400">保存中...</span>}

      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        保存
      </button>

      <button
        type="button"
        onClick={onDeleteFlow}
        className="text-red-400 hover:text-red-300 px-2 py-1.5 text-sm transition-colors"
      >
        削除
      </button>
    </div>
  );
}
