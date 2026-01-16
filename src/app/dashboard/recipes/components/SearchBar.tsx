import { TextInput } from "@/ui/components";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
}: SearchBarProps) {
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div>
      <TextInput
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        startIcon={<Search className="h-4 w-4" />}
        endIcon={
          <Search className="h-4 w-4 cursor-pointer" onClick={onSearch} />
        }
        onKeyDown={handleSearchKeyDown}
      />
    </div>
  );
}
