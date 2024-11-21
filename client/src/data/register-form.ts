import { EMAIL_REGEX, PHONE_REGEX } from "./constant";
import { FieldDetails } from "./user-form";
import * as z from "zod";

export const registerSchema = z.object({
  first_name: z.string({message : "First name is required"}).min(1, "First name is required"),
  last_name: z.string({message : "Last name is required"}).min(1, "Last name is required"),
  email: z
    .string({message : "Email is required"})
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Invalid email format"),
  dob: z.string({message : "Date of birth is required"}).min(1, "Date of birth is required"),
  gender: z.enum(["m", "f", "o"], {message : "gender  is required"}),
  address: z.string({message : "Address is required"}).min(1, "Address is required"),
  phone: z
    .string({message : "Phone number is required"})
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid phone number format"),
  password: z.string({message : "Password is required"}).min(8, "Password should be minimum 8 characters"),
});


export const registerFormDetails: FieldDetails[] = [
  {
    label: "First Name",
    name: "first_name",
    type: "text",
  },
  {
    label: "Last Name",
    name: "last_name",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
  },
  {
    label: "Date of Birth",
    name: "dob",
    type: "date",
  },
  {
    label: "Gender",
    name: "gender",
    type: "select",
    options: [
      { label: "Male", value: "m" },
      { label: "Female", value: "f" },
      { label: "Other", value: "o" },
    ],
  },
  {
    label: "Address",
    name: "address",
    type: "text",
  },
  // {
  //   label: "Role",
  //   name: "role",
  //   type: "select",
  //   disabled: true,
  //   options: [
  //     { label: "Super Admin", value: "super_admin" },
  //     { label: "Artist Manager", value: "artist_manager" },
  //     { label: "Artist", value: "artist" },
  //   ],
  // },
];
