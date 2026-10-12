import { useState } from "react";
import { login, signup } from "../services/assignmentAPI";

function Auth({ onAuth }) {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Student"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const change = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = mode === "login"
                ? await login(form)
                : await signup(form);

            localStorage.setItem("tasktrack_token", data.token);
            localStorage.setItem("tasktrack_user", JSON.stringify(data.user));
            onAuth(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="brand">✓ TaskTrack</div>
                <span className="section-label">YOUR ACADEMIC WORKSPACE</span>

                <h1>{mode === "login" ? "Welcome back." : "Get organized."}</h1>
                <p>Assignments, deadlines and submissions — all in one place.</p>

                <form onSubmit={submit}>
                    {mode === "signup" && (
                        <input
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={change}
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={change}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password (at least 6 characters)"
                        value={form.password}
                        onChange={change}
                        minLength={6}
                        required
                    />

                    {mode === "signup" && (
                        <div className="role-select">
                            {["Student", "Teacher"].map(role => (
                                <button
                                    type="button"
                                    key={role}
                                    className={form.role === role ? "active" : ""}
                                    onClick={() => setForm({ ...form, role })}
                                >
                                    {role === "Student" ? "🎓" : "👩‍🏫"} {role}
                                </button>
                            ))}
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    <button className="primary-button" disabled={loading}>
                        {loading ? "Please wait..." :
                            mode === "login" ? "Sign In →" : "Create Account →"}
                    </button>
                </form>

                <button className="switch" onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                }}>
                    {mode === "login"
                        ? "New to TaskTrack? Create an account"
                        : "Already registered? Sign in"}
                </button>
            </section>
        </main>
    );
}

export default Auth;