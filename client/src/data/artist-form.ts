import { EMAIL_REGEX, PHONE_REGEX } from "./constant";
import { FieldDetails } from "./user-form";
import * as z from "zod";

export const artistFormDetails: FieldDetails[] = [
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
    type: "number",
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
      { label: "Artist", value: "artist" },
    ],
  },
  
  {
    label: "First Release Year",
    name: "first_release_year",
    type: "number",
  },
  {
    label: "Number of Albums Released",
    name: "no_of_albums_released",
    type: "number",
  },
];

export const artistFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Invalid email format"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["m", "f", "o"]),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["super_admin", "artist_manager", "artist"]),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid phone number format"),
  first_release_year: z.any(),
  no_of_albums_released: z.any().optional(),
  password: z.string().min(8, "Password should be minimum 8 characters"),
});