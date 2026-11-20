import { useId } from 'react';
import { IconCheck } from './icons';

export default function CustomCheckbox({
  id,
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
}) {
  const autoId = useId();
  const boxId = id || autoId;

  return (
    <label
      className={`mi-checkbox${checked ? ' is-checked' : ''}${disabled ? ' is-disabled' : ''} ${className}`.trim()}
      htmlFor={boxId}
    >
      <input
        id={boxId}
        type="checkbox"
        className="mi-checkbox-input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, e)}
      />
      <span className="mi-checkbox-box" aria-hidden="true">
        <IconCheck size={12} />
      </span>
      {label ? <span className="mi-checkbox-label">{label}</span> : null}
    </label>
  );
}
