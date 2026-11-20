import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { IconCheck, IconChevronDown } from './icons';

/**
 * Fully custom dropdown (no native <select> popup).
 * options: [{ value: string, label: string }]
 */
export default function CustomSelect({
  id,
  value = '',
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  required = false,
  className = '',
  'aria-label': ariaLabel,
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);

  const hasValue = value !== '' && value != null;
  const selected = hasValue ? options.find((o) => String(o.value) === String(value)) : null;
  const label = selected?.label || placeholder;
  const showPlaceholder = !selected;

  useEffect(() => {
    if (!open) return undefined;

    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => String(o.value) === String(value));
    setActiveIndex(idx >= 0 ? idx : 0);
    // Focus list for keyboard nav
    window.requestAnimationFrame(() => listRef.current?.focus());
  }, [open, options, value]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setDropUp(spaceBelow < 220 && spaceAbove > spaceBelow);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const choose = (next) => {
    onChange?.(String(next));
    setOpen(false);
  };

  const moveActive = (delta) => {
    setActiveIndex((i) => {
      const start = i < 0 ? (delta > 0 ? -1 : 0) : i;
      const next = Math.min(options.length - 1, Math.max(0, start + delta));
      return next;
    });
  };

  const onKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) choose(options[activeIndex].value);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    }
  };

  return (
    <div
      className={`mi-select${open ? ' is-open' : ''}${dropUp ? ' is-drop-up' : ''}${disabled ? ' is-disabled' : ''} ${className}`.trim()}
      ref={rootRef}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        id={selectId}
        className="mi-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        aria-invalid={required && !hasValue ? true : undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`mi-select-value${showPlaceholder ? ' is-placeholder' : ''}`}>{label}</span>
        <span className="mi-select-chevron" aria-hidden="true">
          <IconChevronDown size={16} />
        </span>
      </button>

      {open ? (
        <ul
          ref={listRef}
          className="mi-select-menu"
          role="listbox"
          aria-labelledby={selectId}
          tabIndex={-1}
        >
          {options.map((opt, index) => {
            const isSelected = String(opt.value) === String(value);
            const isActive = index === activeIndex;
            return (
              <li key={`${opt.value}-${opt.label}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  data-index={index}
                  className={`mi-select-option${isSelected ? ' is-selected' : ''}${isActive ? ' is-active' : ''}`}
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(opt.value)}
                >
                  <span>{opt.label}</span>
                  {isSelected ? <IconCheck size={14} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
