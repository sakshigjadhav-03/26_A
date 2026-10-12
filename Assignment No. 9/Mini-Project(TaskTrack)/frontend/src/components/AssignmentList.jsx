import AssignmentCard from "./AssignmentCard";

function AssignmentList({ assignments, user, onStatusChange, onDelete }) {
    if (!assignments.length) {
        return (
            <div className="empty">
                <div className="empty-icon">✓</div>
                <h3>No assignments yet</h3>
                <p>
                    {user.role === "Teacher"
                        ? "Publish an assignment to get started."
                        : "Your teacher's assignments will appear here."}
                </p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {assignments.map(assignment => (
                <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    user={user}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default AssignmentList;