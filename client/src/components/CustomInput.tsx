import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FieldDetails } from "@/data/user-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type CustomInputProps = {
  fielddata: FieldDetails;
  control: any;
};

const CustomInput: React.FC<CustomInputProps> = ({ fielddata, control }) => {
  const { label, name, type, options } = fielddata;
  return (
    <div>
      {type === "select" ? (
        <FormField
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={fielddata?.disabled ?? false}>
                      <SelectValue placeholder="Select an option">
                        {options?.find((option) => option?.value === field.value)
                          ?.label || "Select an option"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      ) : (
        <>
          <FormField
            control={control}
            name={name}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={label} type={type} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default CustomInput;
