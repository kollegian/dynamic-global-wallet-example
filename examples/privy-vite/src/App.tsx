import { usePrivy } from "@privy-io/react-auth";

function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return (
    <div className="container">
      {!ready ? (
        <div>Loading...</div>
      ) : authenticated ? (
        <div>
          <h1>Welcome!</h1>
          <p>Wallet address: {user?.wallet?.address || "no wallet"}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Please Login</h1>
          <button onClick={login}>Login with Privy</button>
        </div>
      )}
    </div>
  );
}

export default App;
