function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="nav-inner">
                <a className="logo" href="#top">✓ TaskTrack</a>

                <div className="user-area">
                    <span className="role">{user.role}</span>
                    <span className="user-name">{user.name}</span>
                    <button className="logout-button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;