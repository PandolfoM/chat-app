import { signInWithEmailAndPassword } from "firebase/auth";
import Button from "../components/Button";
import { Input } from "../components/Input";
import { auth } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { setCurrentUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (data: FormData) => {
    try {
      const signIn = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      setCurrentUser(signIn.user);
      if (signIn.user.displayName === null) {
        navigate("/registername");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const msg: string = err.message;
      setError(msg);
      if (msg.includes("invalid-email")) {
        setError("Invalid email");
      } else if (msg.includes("invalid-credential")) {
        setError("Invalid credentials");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full h-full justify-center p-2"
      onSubmit={handleSubmit(handleLogin)}>
      <h1 className="text-center text-xl">Login</h1>
      <div>
        <Input placeholder="Email" {...register("email")} />
        <p className="text-sm text-error">{errors.email?.message}</p>
      </div>

      <div>
        <Input
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        <p className="text-sm text-error">{errors.password?.message}</p>
      </div>

      <p className="opacity-50 text-sm">
        Don't have an account?{" "}
        <a className="p-0 underline" href="/signup">
          Create an account
        </a>
      </p>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button variant="filled" className="w-full mt-4" type="submit">
        Login
      </Button>
    </form>
  );
}

export default Login;
