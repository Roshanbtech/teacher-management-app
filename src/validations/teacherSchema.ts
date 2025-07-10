import * as Yup from "yup";

export const teacherSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().min(5).required("Phone is required"),
  address: Yup.string().min(3, "Address too short").required("Address is required"),
  role: Yup.string().required("Role is required"),
  status: Yup.string().oneOf(["active", "inactive", "pending"]).required(),
});
