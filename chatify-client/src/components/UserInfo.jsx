export default function UserInfo(){
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}
    const isLoggedIn = !!localStorage.getItem("token");
  
    return (
      <div className="userinfo">
        <div className="brand">Mini Chat 💬</div>
        {isLoggedIn ? (
          <div className="badge">
            <img src={user.avatar} alt="" />
            <span>@{user.username}</span>
          </div>
        ) : (
          <span className="muted">Inte inloggad</span>
        )}
      </div>
    );
  }
  