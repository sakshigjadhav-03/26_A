import { useCallback, useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import Auth from "./components/Auth";

import {
    getAssignments,
    createAssignment,
    updateAssignmentStatus,
    deleteAssignment
} from "./services/assignmentAPI";

import "./App.css";

function App() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("tasktrack_user")) || null;
        } catch {
            return null;
        }
    });

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setAssignments(await getAssignments());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) load();
    }, [user, load]);

    const logout = () => {
        localStorage.removeItem("tasktrack_token");
        localStorage.removeItem("tasktrack_user");
        setUser(null);
        setAssignments([]);
        setError("");
    };

    const save = async data => {
        await createAssignment(data);
        await load();
    };

    const changeStatus = async (id, status, submissionLink = "") => {
        await updateAssignmentStatus(id, status, submissionLink);
        await load();
    };

    const remove = async id => {
        if (!window.confirm("Delete this assignment for all assigned students?"))
            return;

        try {
            await deleteAssignment(id);
            await load();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return (
            <Auth onAuth={setUser} />
        );
    }

    return (
        <>
            <Navbar user={user} onLogout={logout} />

            <main className="container">
                <Dashboard assignments={assignments} user={user} />

                {user.role === "Teacher" && (
                    <AssignmentForm onSave={save} />
                )}

                <section className="work-section" id="assignments">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                {user.role === "Teacher" ? "MANAGE WORK" : "YOUR WORK"}
                            </span>
                            <h2>
                                {user.role === "Teacher"
                                    ? "Published assignments"
                                    : "My assignments"}
                            </h2>
                        </div>

                        <span>{assignments.length} assignments</span>
                    </div>

                    {error && <p className="error page-error">{error}</p>}

                    {loading ? (
                        <div className="empty">Loading assignments...</div>
                    ) : (
                        <AssignmentList
                            assignments={assignments}
                            user={user}
                            onStatusChange={changeStatus}
                            onDelete={remove}
                        />
                    )}
                </section>
            </main>
        </>
    );
}

export default App;