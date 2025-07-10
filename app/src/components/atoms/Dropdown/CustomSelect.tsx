import ReactSelect from "react-select";

export interface CustomSelectProps {
    id?: string;
    enabled?: boolean;
    required?: boolean;
    options: any;
    onChange: any;
    value?: any;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ id, enabled = true, required, value, options, onChange }) => {
    return (
        <ReactSelect
            id={`${id ?? ""}-react-select`}
            placeholder="Select..."
            styles={ReactSelectCustomStyles}
            value={options?.find((opt) => opt.value === value)}
            onChange={onChange}
            isSearchable={false}
            options={options}
            isDisabled={!enabled}
            menuPosition="absolute"
            menuPlacement="auto"
            required={required}
        />
    );
};

export const ReactSelectCustomStyles = {
    control: (styles) => ({
        ...styles,
        boxShadow: "none",
        padding: 0,
        minWidth: 70,
        backgroundColor: "transparent",
        fontSize: 14,
        outline: "none",
        cursor: "pointer",
        border: "1.5px solid #CBD5E1",
        "&:hover": {
            border: "1.8px solid #fbf0e9 !important",
            color: "#db6a24"
        }
    }),
    menuPortal: (base) => ({ ...base, zIndex: 100000 }),
    menu: (base) => ({ ...base, width: "auto", minWidth: "40%", zIndex: 100000 }),
    menuList: (base) => ({
        ...base,
        fontSize: 14,
        "::-webkit-scrollbar": {
            width: "8px",
            height: "0px"
        },
        "::-webkit-scrollbar-track": {
            background: "#f1f1f1"
        },
        "::-webkit-scrollbar-thumb": {
            background: "#db6a24"
        },
        "::-webkit-scrollbar-thumb:hover": {
            background: "#555"
        }
    }),
    valueContainer: (styles) => ({
        ...styles,
        fontSize: 14,
        paddingTop: 0,
        paddingBottom: 0
    }),
    option: (base, { isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? "#db6a24" : "",
        color: isSelected ? "white" : "",
        fontWeight: 600,
        cursor: "pointer",
        ":active": {
            backgroundColor: "#db6a24"
        },
        ":hover": {
            backgroundColor: isSelected ? "#db6a24" : "#fbf0e9",
            color: isSelected ? "white" : "#db6a24"
        }
    }),
    placeholder: (base) => ({
        ...base,
        color: "rgb(100 116 139)",
        fontSize: 12
    }),
    input: (base) => ({
        ...base,
        border: "none",
        fontSize: 12,
        borderStyle: "none",
        paddingTop: 0,
        paddingBottom: 0
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: 2,
        paddingTop: 0,
        paddingBottom: 0
    })
};
