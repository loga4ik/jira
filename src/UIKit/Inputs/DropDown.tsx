import { useState, useEffect, useRef } from "react";

type Option = {
  id: number;
  title: string;
};

type DropDownProps = {
  options: Option[];
  placeholder: string;
  value: number | undefined;
  onChange: (value: number) => void;
};

const DropDown: React.FC<DropDownProps> = ({
  options,
  placeholder,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropDownClick = (event: React.MouseEvent) => {
    // Prevent event from propagating to parent elements (e.g., modal close)
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (event: React.MouseEvent, id: number) => {
    event.stopPropagation(); // Prevent event from closing modal
    onChange(id);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef} onClick={handleDropDownClick}>
      <button
        className="w-full py-2 px-4 border rounded bg-white text-gray-700 focus:outline-none"
        type="button"
      >
        {selectedOption ? selectedOption.title : placeholder}
        <svg
          className="w-4 h-4 inline-block ml-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full border rounded bg-white shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={(event) => handleOptionClick(event, option.id)}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
