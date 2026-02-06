import { RegisterForm } from '../components';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">
            Join Medium Clone.
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to start writing and reading
          </p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Click "Create Account" to continue with mock authentication. <br />
          No real credentials required.
        </p>
      </div>
    </div>
  );
}
