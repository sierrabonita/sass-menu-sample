'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ポップアップメニューの座標情報を管理する型
type MenuPosition = {
  top: number;
  left: number;
} | null;

const RichEditor = () => {
  const [menuPosition, setMenuPosition] = useState<MenuPosition>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 選択範囲を検知し、メニューの表示位置を計算する処理
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();

    // 選択がない、またはキャレットのみ（選択範囲が空）の場合はメニューを閉じる
    if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
      setMenuPosition(null);
      return;
    }

    // 選択された要素がエディタ内に含まれているかチェック
    if (editorRef.current && !editorRef.current.contains(selection.anchorNode)) {
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // window.scrollY/X を加算し、ページ全体に対する絶対座標を計算する
      // メニューを選択範囲の水平方向中央、垂直方向は少し上（-8px）に配置
      const top = rect.top + window.scrollY;
      const left = rect.left + window.scrollX + rect.width / 2;

      setMenuPosition({
        top: top - 8,
        left: left,
      });
    } catch (error) {
      console.error('Failed to calculate selection coordinates:', error);
      setMenuPosition(null);
    }
  }, []);

  // エディタ外（またはメニュー外）をクリックした際の処理
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      // メニュー自体をクリックした場合は閉じない
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      
      // エディタ外をクリックした場合はメニューを閉じ、選択も解除する
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setMenuPosition(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    // 選択解除（ドキュメント上のクリック）を検知
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <>
      <div
        ref={editorRef}
        className="w-full min-h-125 p-8 text-base leading-relaxed text-zinc-800 focus:outline-none"
        contentEditable
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        suppressContentEditableWarning
      >
        <p>
          Next.jsとVercel AI SDKを用いたNotionクローンのデモエディタです。
          ここにあるテキストを選択すると、AIアシストメニューがポップアップで表示されます。
        </p>
        <br />
        <p>
          たとえば、この文章をハイライトしてみてください。選択範囲の真上に、座標計算されたメニューが現れるはずです。
          「要約する」や「翻訳する」などのアクションを想定しています。
        </p>
      </div>

      {/* AIアシストメニュー */}
      {menuPosition && (
        <div
          ref={menuRef}
          className="absolute z-50 flex items-center gap-1 p-1 bg-white border border-zinc-200 rounded-lg shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: 'translate(-50%, -100%)', 
          }}
        >
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
            <span>✨</span> AIに依頼
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-1"></div>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
            要約する
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
            翻訳する
          </button>
        </div>
      )}
    </>
  );
}

export default RichEditor;