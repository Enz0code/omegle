import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className || 'bg-gray-700 hover:bg-gray-600'}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;