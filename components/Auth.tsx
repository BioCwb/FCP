
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const Auth: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha inválidos. Verifique suas credenciais e tente novamente.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está sendo utilizado em outra conta.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        default:
          setError('Ocorreu um erro. Por favor, tente novamente.');
          console.error("Authentication error:", err);
      }
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
      setError('Falha ao fazer login com o Google.');
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-800 p-8 rounded-lg shadow-xl mt-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isLoginView ? 'Login' : 'Cadastro'}</h2>
      <p className="text-slate-400 mb-6 text-center">
        {isLoginView ? 'Faça login para continuar.' : 'Crie uma conta para salvar seus dados.'}
      </p>

      <form onSubmit={handleAuthAction} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 sr-only">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 sr-only">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
          {isLoginView ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="my-4 flex items-center w-full">
        <hr className="w-full border-slate-600"/>
        <span className="px-2 text-slate-400 text-sm">OU</span>
        <hr className="w-full border-slate-600"/>
      </div>
      
      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors"
      >
        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Entrar com Google
      </button>

      <p className="mt-6 text-sm text-slate-400">
        {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button onClick={toggleView} className="ml-1 font-semibold text-cyan-400 hover:underline">
          {isLoginView ? 'Cadastre-se' : 'Faça login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
