import { useState, useEffect, useMemo, memo } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import "./styles/AutocompleteSearch.css";

const AutocompleteSearch = memo(({ searshList, onChose, searchElement }) => {
  const { inputQuery, setInputQuery } = searchElement;
  const debouncedQuery = useDebounce(inputQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return [];
    const searchResult = [];
    for (const item of searshList) {
      if (item.toLowerCase().includes(debouncedQuery.toLowerCase()))
        searchResult.push(item);
      if (searchResult?.length >= 10) break;
    }
    return searchResult;
  }, [debouncedQuery, searshList]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search")) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyboard = (event) => {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        handleChosing(filtered[highlightIndex]);
        setIsOpen(false);
      }
    }
    if (event.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  const handleFocus = () => {
    if (debouncedQuery) setIsOpen(true);
  };

  const handleChosing = (choose) => {
    setInputQuery(choose);
    onChose(choose);
  };

  return (
    <div className="search">
      <input
        type="text"
        className="search__input"
        id="input-search"
        name="input-search"
        value={inputQuery}
        onChange={(event) => {
          setInputQuery(event.target.value);
          setIsOpen(true);
          setHighlightIndex(-1);
        }}
        onKeyDown={handleKeyboard}
        onFocus={handleFocus}
        placeholder="Choose main ingredient"
      />

      {isOpen && filtered.length > 0 && (
        <ul className="search__list">
          {filtered.map((item, index) => (
            <li
              className={`search__result ${
                highlightIndex === index ? "search__result_highlighted" : ""
              }`}
              key={index}
              onClick={() => {
                handleChosing(item);
                setIsOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
export default AutocompleteSearch;
