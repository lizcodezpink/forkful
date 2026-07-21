const inputClasses =
  'w-full rounded-xl border border-crust-200 bg-white px-3.5 py-2.5 text-crust-900 shadow-sm outline-none transition placeholder:text-crust-300 focus:border-crust-400 focus:ring-2 focus:ring-crust-200';

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children?: React.ReactNode;
};

export function FieldWrapper({ label, name, error, hint, children }: BaseProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-crust-800">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-crust-500">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

type TextFieldProps = BaseProps & {
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
  prefix?: string;
};

export function TextField({
  label,
  name,
  error,
  hint,
  type = 'text',
  placeholder,
  defaultValue,
  required,
  autoComplete,
  prefix,
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} name={name} error={error} hint={hint}>
      {prefix ? (
        <div className="flex items-stretch overflow-hidden rounded-xl border border-crust-200 bg-white shadow-sm focus-within:border-crust-400 focus-within:ring-2 focus-within:ring-crust-200">
          <span className="flex items-center whitespace-nowrap border-r border-crust-100 bg-crust-50 px-3 text-sm text-crust-500">
            {prefix}
          </span>
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            autoComplete={autoComplete}
            className="w-full bg-white px-3.5 py-2.5 text-crust-900 outline-none placeholder:text-crust-300"
          />
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          autoComplete={autoComplete}
          className={inputClasses}
        />
      )}
    </FieldWrapper>
  );
}

type TextAreaFieldProps = BaseProps & {
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
};

export function TextAreaField({
  label,
  name,
  error,
  hint,
  placeholder,
  defaultValue,
  rows = 5,
  required,
}: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} name={name} error={error} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className={inputClasses}
      />
    </FieldWrapper>
  );
}
