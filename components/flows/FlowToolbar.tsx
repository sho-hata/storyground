"use client";

interface Props {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onAddStory: () => void;
  onDeleteFlow: () => void;
}

export default function FlowToolbar({ dirty, saving, onSave, onAddStory, onDeleteFlow }: Props) {
  return (
    <div className="border-b border-gray-800 bg-gray-900 px-4 py-2 flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onAddStory}
        className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
      >
        + Story を追加
      </button>

      <div className="flex-1" />

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
