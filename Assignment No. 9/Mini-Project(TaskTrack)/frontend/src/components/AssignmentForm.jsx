import { useEffect, useState } from "react";
import { getStudents } from "../services/assignmentAPI";

function AssignmentForm({ onSave }) {
    const [students, setStudents] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        subject: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignTo: "all",
        studentIds: []
    });

    useEffect(() => {
        getStudents().then(setStudents).catch(err => setError(err.message));
    }, []);

    const change = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const toggleStudent = id => {
        const ids = form.studentIds.includes(id)
            ? form.studentIds.filter(x => x !== id)
            : [...form.studentIds, id];

        setForm({ ...form, studentIds: ids });
    };

    const submit = async e => {
        e.preventDefault();
        setError("");

        if (form.assignTo === "selected" && !form.studentIds.length) {
            setError("Select at least one student.");
            return;
        }

        try {
            setSaving(true);
            await onSave(form);

            setForm({
                title: "",
                subject: "",
                description: "",
                dueDate: "",
                priority: "Medium",
                assignTo: "all",
                studentIds: []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="create-box" id="create">
            <span className="section-label">TEACHER TOOLS</span>
            <h2>Create an assignment</h2>
            <p className="muted">Publish once. Each student gets their own submission status.</p>

            <form className="assignment-form" onSubmit={submit}>
                <input
                    name="title"
                    placeholder="Assignment title"
                    value={form.title}
                    onChange={change}
                    required
                />

                <input
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={change}
                    required
                />

                <label className="field-label">
                    Due date
                    <input
                        type="date"
                        name="dueDate"
                        min={new Date().toLocaleDateString("en-CA")}
                        value={form.dueDate}
                        onChange={change}
                        required
                    />
                </label>

                <select name="priority" value={form.priority} onChange={change}>
                    <option value="Low">Low priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="High">High priority</option>
                </select>

                <textarea
                    name="description"
                    placeholder="Assignment instructions..."
                    value={form.description}
                    onChange={change}
                />

                <div className="assign-box">
                    <strong>Who should receive this assignment?</strong>

                    <div className="assign-options">
                        <button
                            type="button"
                            className={form.assignTo === "all" ? "selected" : ""}
                            onClick={() => setForm({
                                ...form,
                                assignTo: "all",
                                studentIds: []
                            })}
                        >
                            👥 All Students
                        </button>

                        <button
                            type="button"
                            className={form.assignTo === "selected" ? "selected" : ""}
                            onClick={() => setForm({
                                ...form,
                                assignTo: "selected"
                            })}
                        >
                            ☑ Select Students
                        </button>
                    </div>

                    {form.assignTo === "selected" && (
                        <div className="student-picker">
                            {students.map(student => (
                                <label key={student._id} className="student-option">
                                    <input
                                        type="checkbox"
                                        checked={form.studentIds.includes(student._id)}
                                        onChange={() => toggleStudent(student._id)}
                                    />
                                    <span>
                                        {student.name}
                                        <small>{student.email}</small>
                                    </span>
                                </label>
                            ))}

                            {!students.length && (
                                <p className="muted">No student accounts found yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {error && <p className="error">{error}</p>}

                <button className="primary-button" disabled={saving}>
                    {saving ? "Publishing..." : "Publish Assignment →"}
                </button>
            </form>
        </section>
    );
}

export default AssignmentForm;