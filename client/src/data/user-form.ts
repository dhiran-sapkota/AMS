import { EMAIL_REGEX, PHONE_REGEX } from "./constant";
import * as z from "zod";

export type FieldDetails = {
  label: string;
  name: string;
  type: string;
  options?: { label: string; value: any }[];
  disabled?: boolean;
};

export const userUpdateSchema = z.object({
  firstname: z.string({message : "First name is required"}).min(1, "First name is required"),
  lastname: z.string({message : "Last name is required"}).min(1, "Last name is required"),
  email: z
    .string({message : "Email is required"})
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Invalid email format"),
  dob: z.string({message : "dob is required"}).min(1, "Date of birth is required"),
  gender: z.enum(["m", "f", "o"], {message :"gender is required"}),
  address: z.string({message : "address is required"}).min(1, "Address is required"),
  role: z.enum(["super_admin", "artist_manager", "artist"], {message : "role is required"}),
  phone: z
    .string({message : "Phone number is required"})
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid phone number format"),
});

export const userFormSchema = userUpdateSchema.extend({
  password: z.string().min(8, "Password should be minimum 8 characters"),
});

export const userFormDetails: FieldDetails[] = [
  {
    label: "First Name",
    name: "firstname",
    type: "text",
  },
  {
    label: "Last Name",
    name: "lastname",
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
  {
    label: "Role",
    name: "role",
    type: "select",
    options: [
      // { label: "Super Admin", value: "super_admin" },
      { label: "Artist Manager", value: "artist_manager" },
      // { label: "Artist", value: "artist" },
    ],
  },
];
