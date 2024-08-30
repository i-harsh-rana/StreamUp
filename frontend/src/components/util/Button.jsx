import React from 'react'

function Button({
    children,
    type = "button",
    bgcolor = 'bg-white',
    className = "",
    disabled = false,
    ...props
}) {
  return (
    <button
        type={type}
        className={`${bgcolor} ${className} px-4 py-2 rounded-full hover:bg-hopbush-main hover:text-white transition ease-in-out delay-100 min-w-fit`}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
  )
}

export default Button
