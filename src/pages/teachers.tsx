import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Teacher, Schedule, TimeSlot } from "../types";
import TeacherDetails from "../components/TeacherDetails";
import { CalendarGrid } from "../components/CalendarGrid";
import { loadTeachers, saveTeachers } from "../utils/storageHelpers";
import { Plus, Trash2, X, Menu } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { teacherSchema } from "../validations/teacherSchema";
import { useApp } from "../contexts/AppContext";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useDebounce } from "../hooks/useDebounce";

const PAGE_SIZE = 10;

const emptyTeacher: Teacher = {
  id: "",
  name: "",
  role: "Teacher",
  email: "",
  phone: "",
  address: "",
  status: "active",
  qualifications: [],
  schedule: undefined,
};

const emptySchedule = (teacherId: string): Schedule => ({
  teacherId,
  weekStartDate: new Date().toISOString(),
  slots: [],
});

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Teacher>(emptyTeacher);
  const [addErrors, setAddErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const { addNotification } = useApp();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = loadTeachers();
      setTeachers(data);
      setSelected(data[0] || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) saveTeachers(teachers);
  }, [teachers, loading]);

  const filteredTeachers = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return term ? teachers.filter(t => t.name.toLowerCase().includes(term)) : teachers;
  }, [teachers, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / PAGE_SIZE));
  const shownTeachers = useMemo(
    () => filteredTeachers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredTeachers, page]
  );

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleAddFormChange = useCallback(
    (field: keyof Teacher, value: string) => {
      setAddForm(prev => ({ ...prev, [field]: value }));
      if (addErrors[field]) setAddErrors(prev => ({ ...prev, [field]: "" }));
    },
    [addErrors]
  );

  const handleAdd = useCallback(async () => {
    try {
      await teacherSchema.validate(addForm, { abortEarly: false });
      const newTeacher = {
        ...addForm,
        id: uuidv4(),
        qualifications: [],
        schedule: emptySchedule(uuidv4()),
      };
      setTeachers(prev => [...prev, newTeacher]);
      setSelected(newTeacher);
      addNotification({ type: "success", message: "Teacher added successfully." });
      setAdding(false);
      setAddForm(emptyTeacher);
      setAddErrors({});
      setSidebarOpen(false);
    } catch (err: any) {
      const errs: { [k: string]: string } = {};
      if (err.inner) err.inner.forEach((e: any) => (errs[e.path] = e.message));
      setAddErrors(errs);
    }
  }, [addForm, addNotification]);

  const handleUpdate = useCallback((updated: Teacher) => {
    setTeachers(prev => prev.map(t => (t.id === updated.id ? { ...t, ...updated } : t)));
    setSelected(updated);
    addNotification({ type: "success", message: "Teacher updated successfully." });
  }, [addNotification]);

  const handleScheduleChange = useCallback((schedule: Schedule) => {
    if (!selected) return;
    setTeachers(prev => prev.map(t => t.id === selected.id ? { ...t, schedule } : t));
    setSelected(prev => prev && prev.id === schedule.teacherId ? { ...prev, schedule } : prev);
    addNotification({ type: "success", message: "Schedule updated successfully." });
  }, [selected, addNotification]);

  const handleSlotClick = useCallback((slot: TimeSlot) => {
    if (!selected) return;
    const schedule = selected.schedule ?? emptySchedule(selected.id);
    const slots = [...schedule.slots];
    const idx = slots.findIndex(s => s.day === slot.day && s.startTime === slot.startTime);
    if (idx >= 0) {
      const cycle: Record<string, "available" | "booked" | "unavailable"> = {
        available: "booked",
        booked: "unavailable",
        unavailable: "available",
      };
      slots[idx] = { ...slots[idx], status: cycle[slots[idx].status] };
    } else {
      slots.push(slot);
    }
    handleScheduleChange({ ...schedule, slots });
  }, [selected, handleScheduleChange]);

  const handleDelete = useCallback((id: string) => {
    setTeachers(prev => {
      const arr = prev.filter(t => t.id !== id);
      if (selected?.id === id) setSelected(arr[0] || null);
      return arr;
    });
    addNotification({ type: "success", message: "Teacher deleted successfully." });
  }, [selected, addNotification]);

  const handleAddClick = () => { setAdding(true); setAddForm(emptyTeacher); setAddErrors({}); };
  const handleCancelAdd = () => { setAdding(false); setAddForm(emptyTeacher); setAddErrors({}); };
  const handleSelectTeacher = (teacher: Teacher) => {
    setSelected(teacher);
    setSidebarOpen(false);
  };

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));

  const AddTeacherForm = (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4 relative">
      <button onClick={handleCancelAdd} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1">
        <X size={16} />
      </button>
      <h3 className="font-semibold text-lg mb-3 text-blue-900">Add New Teacher</h3>
      <div className="space-y-3">
        <input
          className={`w-full border rounded-md p-2 text-sm ${addErrors.name ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
          placeholder="Full Name *"
          value={addForm.name}
          onChange={e => handleAddFormChange("name", e.target.value)}
          autoFocus
        />
        {addErrors.name && <div className="text-red-500 text-xs mt-1">{addErrors.name}</div>}
        <input
          className={`w-full border rounded-md p-2 text-sm ${addErrors.email ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
          placeholder="Email Address *"
          type="email"
          value={addForm.email}
          onChange={e => handleAddFormChange("email", e.target.value)}
        />
        {addErrors.email && <div className="text-red-500 text-xs mt-1">{addErrors.email}</div>}
        <input
          className={`w-full border rounded-md p-2 text-sm ${addErrors.phone ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
          placeholder="Phone Number *"
          type="tel"
          value={addForm.phone}
          onChange={e => handleAddFormChange("phone", e.target.value)}
        />
        {addErrors.phone && <div className="text-red-500 text-xs mt-1">{addErrors.phone}</div>}
        <textarea
          className={`w-full border rounded-md p-2 text-sm resize-none ${addErrors.address ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
          placeholder="Address *"
          rows={2}
          value={addForm.address}
          onChange={e => handleAddFormChange("address", e.target.value)}
        />
        {addErrors.address && <div className="text-red-500 text-xs mt-1">{addErrors.address}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select className="w-full border rounded-md p-2 text-sm" value={addForm.role} onChange={e => handleAddFormChange("role", e.target.value)}>
            <option>Teacher</option>
            <option>Senior Teacher</option>
            <option>Department Head</option>
            <option>Substitute Teacher</option>
          </select>
          <select className="w-full border rounded-md p-2 text-sm" value={addForm.status} onChange={e => handleAddFormChange("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleAdd}>
            Add Teacher
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium" onClick={handleCancelAdd}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Teachers</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-1/3 xl:w-1/4 
          bg-white shadow-lg lg:shadow-sm border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full
        `}>
          {/* Sidebar Header */}
          <header className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Teachers</h2>
            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:bg-blue-100 rounded-md p-1.5" onClick={handleAddClick} disabled={adding}>
                <Plus size={20} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
          </header>
          
          {/* Search Bar */}
          <div className="p-4 lg:p-6 border-b border-gray-100 flex-shrink-0">
            <input
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search teachers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4">
              {adding && !loading && AddTeacherForm}
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex items-center gap-3 p-3">
                      <LoadingSkeleton width={40} height={40} rounded="full" />
                      <div className="flex-1">
                        <LoadingSkeleton width="70%" height={16} className="mb-2" />
                        <LoadingSkeleton width="50%" height={12} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {shownTeachers.map(teacher => (
                    <div
                      key={teacher.id}
                      className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 transition-all ${
                        selected?.id === teacher.id
                          ? "bg-blue-50 border border-blue-200 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => handleSelectTeacher(teacher)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${teacher.name}`}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectTeacher(teacher);
                        }
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold text-sm">
                            {teacher.name ? teacher.name[0].toUpperCase() : "?"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{teacher.name}</div>
                        <div className="text-xs text-gray-500 truncate">{teacher.role}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            teacher.status === "active"
                              ? "bg-green-100 text-green-700"
                              : teacher.status === "inactive"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                        </span>
                        <button
                          className="text-red-400 hover:text-red-600 p-1 rounded"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(teacher.id);
                          }}
                          aria-label={`Delete ${teacher.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <button
                    className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={handlePrevPage}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              )}
              
              {!loading && filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {search ? "No teachers found matching your search." : "No teachers added yet."}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 lg:p-6">
              <LoadingSkeleton width="100%" height={300} rounded="lg" />
            </div>
          ) : selected ? (
            <div className="p-4 lg:p-6 space-y-6">
              <TeacherDetails teacher={selected} onUpdate={handleUpdate} />
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
                <div className="overflow-x-auto">
                  <CalendarGrid
                    schedule={selected.schedule ?? emptySchedule(selected.id)}
                    onSlotClick={handleSlotClick}
                    readonly={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <p className="text-lg font-medium">Select a teacher to view details</p>
                <p className="text-sm">Choose from the list to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeachersPage;