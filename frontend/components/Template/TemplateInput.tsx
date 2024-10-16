interface I {
    label: string;
    id: string;
    placeholder: string;
    variant: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] placeholder-white/50";
const sign = "form-input w-full"

const variantsInput: { [key: string]: string } = {
    "blue": blue,
    "sign": sign,
}
const variantsLabels: { [key: string]: string } = {
    "blue": "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
    "sign": "block text-sm font-medium text-indigo-200/65",
}

export default function TemplateInput({label, id, placeholder, onChange, variant}: I) {
    return (
        <div>
            <label htmlFor={id}
                   className={variantsLabels[variant]}
            >
                {label}
            </label>
            <input type="text"
                   id={id}
                   className={variantsInput[variant]}
                   placeholder={placeholder}
                   onChange={onChange}
                   required
            />
        </div>
    )
}
