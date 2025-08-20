export default function Profile(){
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}
  
    function logout(){
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        window.location.href = "/login"; // full reload -> ingen chans att Chat hinner hämta
      }
    }
  
    return (
      <div className="container">
        <h1>Profil</h1>
        <div className="card" style={{maxWidth:420}}>
          <img src={user.avatar} alt="" style={{width:96,height:96,borderRadius:"50%",objectFit:"cover"}}/>
          <h2 style={{marginTop:12}}>@{user.username || "okänd"}</h2>
          {user.email && <p>{user.email}</p>}
          <button onClick={logout}>Logga ut</button>
        </div>
      </div>
    );
  }
  