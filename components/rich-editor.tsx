'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCompletion } from '@ai-sdk/react';

// ポップアップメニューの座標情報を管理する型
type MenuPosition = {
  top: number;
  left: number;
} | null;

const RichEditor = () => {
  const [menuPosition, setMenuPosition] = useState<MenuPosition>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isInputMode, setIsInputMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Vercel AI SDKを使用してストリーミングレスポンスを管理
  const { completion, complete, isLoading, setCompletion } = useCompletion({
    api: '/api/completion',
    streamProtocol: 'text',
  });

  // 選択範囲を検知し、メニューの表示位置を計算する処理
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();

    // 選択がない、またはキャレットのみ（選択範囲が空）の場合はメニューを閉じる
    if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
      setMenuPosition(null);
      setIsInputMode(false);
      setCustomPrompt('');
      setCompletion('');
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
      setSelectedText(selection.toString());
    } catch (error) {
      console.error('Failed to calculate selection coordinates:', error);
      setMenuPosition(null);
    }
  }, [setCompletion]);

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
        setIsInputMode(false);
        setCustomPrompt('');
        setCompletion('');
        window.getSelection()?.removeAllRanges();
      }
    };

    // 選択解除（ドキュメント上のクリック）を検知
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [setCompletion]);

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
          className="absolute z-50 flex flex-col p-1 bg-white border border-zinc-200 rounded-lg shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: 'translate(-50%, -100%)', 
          }}
        >
          {isInputMode ? (
            <div className="flex items-center p-1 w-64">
              <input
                type="text"
                autoFocus
                placeholder="AIに指示... (Enterで送信)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customPrompt.trim() && !isLoading) {
                    e.preventDefault();
                    complete(customPrompt, {
                      body: {
                        selectedText,
                        action: 'custom',
                        customPrompt,
                      },
                    });
                  }
                }}
                className="w-full px-2 py-1.5 text-sm outline-none border border-zinc-200 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsInputMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors whitespace-nowrap"
              >
                <span>✨</span> AIに依頼
              </button>
              <div className="w-px h-4 bg-zinc-200 mx-1"></div>
              <button className="px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors whitespace-nowrap">
                要約する
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors whitespace-nowrap">
                翻訳する
              </button>
            </div>
          )}

          {/* AIレスポンスのストリーミング表示 */}
          {(isLoading || completion) && (
            <div className="m-1 p-2 text-sm text-zinc-700 bg-zinc-50 rounded border border-zinc-100 max-h-48 overflow-y-auto whitespace-pre-wrap">
              {completion}
              {isLoading && !completion && <span className="text-zinc-400">AIが考え中...</span>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RichEditor;