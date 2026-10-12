function Dashboard({ assignments, user }) {
    const getMyStatus = a =>
        a.students?.find(s =>
            String(s.student?._id || s.student) === String(user.id)
        )?.status;

    const pending = user.role === "Student"
        ? assignments.filter(a => getMyStatus(a) === "Pending").length
        : assignments.reduce((n, a) =>
            n + (a.students || []).filter(s => s.status === "Pending").length, 0);

    const submitted = user.role === "Student"
        ? assignments.filter(a => getMyStatus(a) === "Submitted").length
        : assignments.reduce((n, a) =>
            n + (a.students || []).filter(s => s.status === "Submitted").length, 0);

    return (
        <section className="hero" id="top">
            <span className="section-label">
                {user.role.toUpperCase()} DASHBOARD
            </span>

            <h1>
                {user.role === "Teacher" ? "Welcome back" : "Good to see you"},
                {" "}{user.name.split(" ")[0]} 👋
            </h1>

            <p>
                {user.role === "Teacher"
                    ? "Publish assignments and track every student's progress."
                    : "Keep your coursework organized and submit on time."}
            </p>

            <div className="stats">
                <div>
                    <strong>{assignments.length}</strong>
                    <span>{user.role === "Teacher" ? "Assignments" : "My Assignments"}</span>
                </div>
                <div>
                    <strong>{pending}</strong>
                    <span>Pending</span>
                </div>
                <div>
                    <strong>{submitted}</strong>
                    <span>Submitted</span>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;