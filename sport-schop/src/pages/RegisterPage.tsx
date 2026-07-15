import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      await register(form);
      navigate("/connexion");
    } catch (err: any) {
      const data = err?.response?.data;
      if (data) {
        const premierMessage = Object.values(data)[0];
        setErreur(Array.isArray(premierMessage) ? premierMessage[0] : String(premierMessage));
      } else {
        setErreur("Erreur lors de l'inscription.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-8 text-center">Créer un compte</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
          <input type="text" name="username" required value={form.username} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" name="password" required value={form.password} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input type="password" name="password2" required value={form.password2} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
        </div>

        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

        <button type="submit" disabled={envoi}
          className="w-full bg-primary text-white py-3 text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50 mt-2">
          {envoi ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?{" "}
        <Link to="/login" className="text-primary-dark underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}