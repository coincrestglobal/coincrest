import { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

function FilterDropdown({
  options,
  selectedFilters,
  setSelectedFilters,
  style,
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openGroup, setOpenGroup] = useState(
    options.length > 0 ? options[0].label : null
  );
  const [tempDateFilters, setTempDateFilters] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
        setOpenGroup(options.length > 0 ? options[0].label : null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, options]);

  const handleSelect = (category, value) => {
    setSelectedFilters((prevFilters) => {
      const selectedFilters = { ...prevFilters.selectedFilters };
      if (selectedFilters[category] === value) {
        delete selectedFilters[category];
      } else {
        selectedFilters[category] = value;
      }
      return { ...prevFilters, selectedFilters };
    });
  };

  const handleTempDateChange = (key, value) => {
    setTempDateFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCommitDates = (category) => {
    const { startDate, endDate } = tempDateFilters;
    if (startDate && endDate) {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters.selectedFilters };
        updatedFilters[category] = { startDate, endDate };
        return {
          ...prevFilters,
          selectedFilters: updatedFilters,
        };
      });
    } else {
      alert("Please enter both Start Date and End Date.");
    }
  };

  const handleClearDates = (category) => {
    setTempDateFilters((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters.selectedFilters };
      delete updatedFilters[category];
      return {
        ...prevFilters,
        selectedFilters: updatedFilters,
      };
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className="bg-button hover:bg-button-hover text-white px-3 py-1.5 rounded-md shadow-md flex items-center justify-center space-x-2 cursor-pointer transition text-sm focus:outline-none h-9"
      >
        <FaFilter className="w-4 h-4" />
        <span className="text-sm">Filter</span>
      </button>

      {/* Dropdown Menu */}
      {openDropdown && (
        <div
          className={`absolute right-0 mt-2 flex flex-col gap-1 bg-primary-dark border border-primary-dark-dark shadow-lg rounded-md z-50 overflow-y-auto ${
            style?.width || "w-48"
          }`}
        >
          {options.map((group) => (
            <div key={group.label}>
              {/* Group Label */}
              <div
                className="px-4 py-2 text-text-heading font-semibold bg-button cursor-pointer hover:bg-button-hover"
                onClick={() =>
                  setOpenGroup(openGroup === group.label ? null : group.label)
                }
              >
                {group.label}
              </div>

              {/* Group Options */}
              {openGroup === group.label && (
                <ul className="flex flex-col bg-primary-dark-light border-t border-primary-dark-dark">
                  {group.children.map((option, index) => {
                    if (option.type === "date") {
                      return (
                        <li
                          key={index}
                          className="px-4 py-2 flex flex-col relative"
                        >
                          <label className="text-text-subheading font-medium">
                            {option.label}
                          </label>
                          <input
                            type="date"
                            value={tempDateFilters[option.value] || ""}
                            onChange={(e) =>
                              handleTempDateChange(option.value, e.target.value)
                            }
                            className="border border-primary-light2-dark rounded px-2 py-1"
                          />
                        </li>
                      );
                    } else {
                      return (
                        <li
                          key={option.value}
                          className={`px-4 py-2  text-sm cursor-pointer flex items-center justify-between hover:bg-primary-dark transition ${
                            selectedFilters[group.label] === option.value
                              ? "font-bold text-text-heading bg-primary-light2"
                              : "text-text-subheading"
                          }`}
                          onClick={() =>
                            handleSelect(group.label, option.value)
                          }
                        >
                          {option.label}
                          {selectedFilters[group.label] === option.value && (
                            <span>✅</span>
                          )}
                        </li>
                      );
                    }
                  })}

                  {/* Date Buttons */}
                  {group.label === "Date Interval" && (
                    <div className="flex items-center justify-between mt-2 px-2 p-1">
                      <button
                        onClick={() => handleClearDates(group.label)}
                        className={`text-white px-2 py-1 rounded-md bg-statusColor-error ${
                          tempDateFilters.startDate || tempDateFilters.endDate
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        ❌
                      </button>
                      {tempDateFilters.startDate && tempDateFilters.endDate && (
                        <button
                          onClick={() => handleCommitDates(group.label)}
                          className="cursor-pointer bg-button hover:bg-button-hover text-white px-3 py-1 rounded-md"
                        >
                          Apply Dates
                        </button>
                      )}
                    </div>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
