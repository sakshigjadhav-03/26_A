import { useState } from "react";

function AssignmentCard({ assignment, user, onStatusChange, onDelete }) {
    const [link, setLink] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const mine = assignment.students?.find(s =>
        String(s.student?._id || s.student) === String(user.id)
    );

    const submittedCount = assignment.students?.filter(
        s => s.status === "Submitted"
    ).length || 0;

    const submit = async status => {
        setError("");

        if (status === "Submitted" && !link.trim() && !mine?.submissionLink) {
            setError("Add your submission link first.");
            return;
        }

        try {
            setSaving(true);
            await onStatusChange(
                assignment._id,
                status,
                link.trim() || mine?.submissionLink || ""
            );
            setLink("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <article className="task-card">
            <div className="task-content">
                <span className={`priority ${assignment.priority?.toLowerCase()}`}>
                    {assignment.priority} Priority
                </span>

                <h3>{assignment.title}</h3>
                <p className="subject">{assignment.subject}</p>
                <p>{assignment.description || "No additional instructions."}</p>

                <div className="task-info">
                    <span>
                        📅 {new Date(assignment.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })}
                    </span>

                    {user.role === "Teacher" ? (
                        <span>
                            👥 {submittedCount}/{assignment.students?.length || 0} submitted
                        </span>
                    ) : (
                        <span>👩‍🏫 {assignment.createdBy?.name || "Teacher"}</span>
                    )}
                </div>

                {user.role === "Student" && mine && (
                    <div className="submission-area">
                        <p>
                            Your status:{" "}
                            <strong className={`status-${mine.status.toLowerCase().replace(" ", "-")}`}>
                                {mine.status}
                            </strong>
                        </p>

                        {mine.submissionLink && (
                            <a href={mine.submissionLink} target="_blank" rel="noreferrer">
                                View my submitted work ↗
                            </a>
                        )}

                        {mine.status !== "Submitted" && (
                            <>
                                <input
                                    type="url"
                                    placeholder="Paste Google Drive or GitHub link"
                                    value={link}
                                    onChange={e => setLink(e.target.value)}
                                />

                                <div className="action-row">
                                    <button disabled={saving} onClick={() => submit("Submitted")}>
                                        {saving ? "Submitting..." : "Submit Work →"}
                                    </button>

                                    <button
                                        className="secondary-button"
                                        disabled={saving}
                                        onClick={() => submit("In Progress")}
                                    >
                                        Mark In Progress
                                    </button>
                                </div>
                            </>
                        )}

                        {error && <p className="error">{error}</p>}
                    </div>
                )}

                {user.role === "Teacher" && (
                    <div className="student-results">
                        <strong>Student progress</strong>

                        {assignment.students?.map(s => (
                            <div
                                className="student-result"
                                key={s.student?._id || s.student}
                            >
                                <span>
                                    {s.student?.name || "Student"}
                                    <small>{s.student?.email || ""}</small>
                                </span>

                                <span className={`status-${s.status.toLowerCase().replace(" ", "-")}`}>
                                    {s.status}
                                </span>

                                {s.submissionLink && (
                                    <a href={s.submissionLink} target="_blank" rel="noreferrer">
                                        View work ↗
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {user.role === "Teacher" && (
                <button className="danger-button" onClick={() => onDelete(assignment._id)}>
                    Delete
                </button>
            )}
        </article>
    );
}

export default AssignmentCard;