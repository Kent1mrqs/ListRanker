import {Stack} from "@mui/material";

interface I {
    label: string;
    id: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] placeholder-white/50";

export default function TemplateInput({label, id, placeholder, onChange}: I) {
    return (
        <Stack alignItems="center" spacing={1}>
            <label htmlFor={id}
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <input type="text"
                   id={id}
                   className={blue}
                   placeholder={placeholder}
                   onChange={onChange}
                   required
            />
        </Stack>
    )
}
