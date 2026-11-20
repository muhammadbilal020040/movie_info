import { useEffect } from 'react';

function isBlockedShortcut(e) {
  const key = e.key?.toLowerCase();
  const ctrlOrMeta = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;

  // F12
  if (e.key === 'F12') return true;

  // Ctrl/Cmd + Shift + I / J / C
  if (ctrlOrMeta && shift && (key === 'i' || key === 'j' || key === 'c')) return true;

  // Ctrl/Cmd + U (view source)
  if (ctrlOrMeta && !shift && key === 'u') return true;

  // Ctrl/Cmd + S (save page)
  if (ctrlOrMeta && !shift && key === 's') return true;

  return false;
}

/** Blocks right-click Inspect and common DevTools / view-source shortcuts. */
export default function DisableInspect() {
  useEffect(() => {
    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      if (!isBlockedShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  return null;
}
