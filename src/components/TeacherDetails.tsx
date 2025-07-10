import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Teacher, Qualification } from "../types";
import { Edit2, Save, X, User, Mail, Phone, MapPin, Shield } from "lucide-react";
import Qualifications from "./Qualifications";
import { teacherSchema } from "../validations/teacherSchema";

interface TeacherDetailsProps {
  teacher: Teacher;
  onUpdate: (teacher: Teacher) => void;
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ teacher, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Teacher>(teacher);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    setFormData(teacher);
    setErrors({});
    setIsEditing(false);
  }, [teacher]);

  const statusColor = useMemo(() => {
    switch (formData.status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, [formData.status]);

  const handleChange = useCallback(
    (field: keyof Teacher, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [errors]
  );

  const validate = useCallback(async () => {
    try {
      await teacherSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const errs: { [k: string]: string } = {};
      if (err.inner) err.inner.forEach((e: any) => (errs[e.path] = e.message));
      setErrors(errs);
      return false;
    }
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (await validate()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  }, [formData, onUpdate, validate]);

  const handleCancel = useCallback(() => {
    setFormData(teacher);
    setIsEditing(false);
    setErrors({});
  }, [teacher]);

  const handleEdit = useCallback(() => setIsEditing(true), []);

  const handleQualChange = useCallback(
    (qualifications: Qualification[]) => {
      const updatedTeacher = { ...formData, qualifications };
      setFormData(updatedTeacher);
      onUpdate(updatedTeacher); // auto-save
    },
    [formData, onUpdate]
  );

  const FormField = useMemo(
    () =>
      ({
        icon: Icon,
        label,
        field,
        type = "text",
        placeholder,
        isTextarea = false,
        options = null,
      }: {
        icon: React.ElementType;
        label: string;
        field: keyof Teacher;
        type?: string;
        placeholder?: string;
        isTextarea?: boolean;
        options?: string[] | null;
      }) => (
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Icon size={16} className="mr-2 text-gray-500" />
            {label}
          </label>
          {isEditing ? (
            options ? (
              <select
                value={formData[field] as string}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : isTextarea ? (
              <textarea
                value={formData[field] as string}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder={placeholder}
                rows={3}
              />
            ) : (
              <input
                type={type}
                value={formData[field] as string}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder={placeholder}
                autoFocus={field === "name"}
              />
            )
          ) : (
            <div className="text-gray-900 py-2 min-h-[2.5rem] flex items-center">
              {formData[field] as string || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </div>
          )}
          {errors[field] && (
            <p className="text-xs text-red-600 mt-1">{errors[field]}</p>
          )}
        </div>
      ),
    [formData, errors, handleChange, isEditing]
  );

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Teacher Details</h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <Edit2 size={16} className="mr-1" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
              >
                <X size={16} className="mr-1" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{formData.name || "No Name"}</h3>
            <p className="text-gray-600 mb-2">{formData.role}</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                formData.status === "active"
                  ? "bg-green-500"
                  : formData.status === "inactive"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`} />
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <FormField icon={User} label="Full Name" field="name" placeholder="Enter full name" />
            <FormField
              icon={Shield}
              label="Role"
              field="role"
              options={["Teacher", "Senior Teacher", "Department Head", "Substitute Teacher"]}
            />
            <FormField icon={Mail} label="Email Address" field="email" type="email" placeholder="Enter email address" />
          </div>
          <div className="space-y-6">
            <FormField icon={Phone} label="Phone Number" field="phone" type="tel" placeholder="Enter phone number" />
            <FormField icon={MapPin} label="Address" field="address" placeholder="Enter address" isTextarea />
            {isEditing && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Shield size={16} className="mr-2 text-gray-500" />
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="border-t border-gray-200 pt-6">
          <Qualifications
            qualifications={formData.qualifications || []}
            onChange={handleQualChange}
            readonly={!isEditing}
          />
        </div>
      </div>
    </section>
  );
};

export default TeacherDetails;
