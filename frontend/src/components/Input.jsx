import React, { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({
  label,
  className = "",
  labelClassName = "",
  error,
  type = "text",
  ...props
}, ref) {

  const id = useId();
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className={`inline-block mb-1 pl-1 ${labelClassName}`}>{label}</label>}
      <input
        type={type}
        ref={ref}
        id={id}
        {...props}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none w-full focus:bg-gray-50 duration-200 border ${error ? 'border-red-500' : 'border-gray-200'} ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export default Input;
