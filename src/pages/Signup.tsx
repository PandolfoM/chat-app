import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth/context";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Input } from "../components/Input";
import Button from "../components/Button";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { setCurrentUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");

  const handleSignup = (data: FormData) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
      })
      .catch((err) => {
        const msg: string = err.message;
        setError(msg);
      });
  };

  return (
    <form
      className="flex flex-col gap-2 w-full h-full justify-center p-2"
      onSubmit={handleSubmit(handleSignup)}>
      <h1 className="text-center text-xl">Create Account</h1>
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
        Already have an account?{" "}
        <a className="p-0 underline" href="/login">
          Login
        </a>
      </p>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button className="w-full mt-4" type="submit">
        Create Account
      </Button>
    </form>
  );
}

export default Signup;
