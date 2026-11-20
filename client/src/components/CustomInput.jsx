import { useId, useRef } from 'react';

export function CustomInput({ className = '', ...props }) {
  return <input className={`mi-input ${className}`.trim()} {...props} />;
}

export function CustomTextarea({ className = '', ...props }) {
  return <textarea className={`mi-input mi-textarea ${className}`.trim()} {...props} />;
}

export function CustomFileInput({
  id,
  accept,
  onChange,
  disabled = false,
  buttonLabel = 'Choose file',
  emptyLabel = 'No file chosen',
  fileName,
  className = '',
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const ref = useRef(null);

  return (
    <div className={`mi-file ${className}`.trim()}>
      <input
        ref={ref}
        id={inputId}
        type="file"
        className="mi-file-input"
        accept={accept}
        disabled={disabled}
        onChange={onChange}
      />
      <button
        type="button"
        className="mi-file-btn"
        disabled={disabled}
        onClick={() => ref.current?.click()}
      >
        {buttonLabel}
      </button>
      <span className="mi-file-name">{fileName || emptyLabel}</span>
    </div>
  );
}
