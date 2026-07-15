import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const from = (location.state as { from?: string })?.from;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const user = await login(username, password);

      if (user.is_staff) {
        navigate("/admin-dashboard");
      } else if (from) {
        navigate(from);
      } else {
        navigate("/checkout");
      }
    } catch (err) {
      setErreur("Identifiants incorrects.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-8 text-center">Connexion</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary"
          />
        </div>

        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-primary text-white py-3 text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {envoi ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-primary-dark underline">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}