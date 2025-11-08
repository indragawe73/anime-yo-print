import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from '@mui/material';

interface Props extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, onClear, InputProps: inputProps, ...props }: Props) {
  const handleClear = () => {
    onClear?.();
    onChange('');
  };

  const mergedInputProps = {
    ...inputProps,
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
    endAdornment: value
      ? (
        <InputAdornment position="end">
          <IconButton
            size="small"
            aria-label="Clear search"
            onClick={handleClear}
            edge="end"
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      )
      : inputProps?.endAdornment,
  };

  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search anime titles..."
      fullWidth
      autoComplete="off"
      InputProps={mergedInputProps}
      {...props}
    />
  );
}

