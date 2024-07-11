import Button from "../components/Button";
import { Input } from "../components/Input";

function Login() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4 p-2">
      <div className="flex flex-col gap-2 w-full">
        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />
        <p className="opacity-50 text-sm">
          Don't have an account?{" "}
          <Button variant="ghost" className="p-0">
            Sign up
          </Button>
        </p>
      </div>
      <Button className="w-full">Login</Button>
    </div>
  );
}

export default Login;
