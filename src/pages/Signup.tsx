import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth/context";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { getProfileColor } from "../lib/utils";

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
  const navigate = useNavigate();

  const handleSignup = async (data: FormData) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        email: data.email,
        id: res.user.uid,
        status: "online",
        statusMsg: "",
        blocked: [],
        color: getProfileColor(),
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      setCurrentUser(res.user);
      navigate("/registername");
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full gap-14">
      <div className="h-full flex flex-col justify-end px-5">
        <h1 className="text-5xl font-bold">
          Welcome to
          <br /> Chat 👋
        </h1>
      </div>
      <div className="bg-backgroundSecondary rounded-t-2xl h-full">
        <form
          className="flex flex-col gap-2 w-full h-full p-2"
          onSubmit={handleSubmit(handleSignup)}>
          <h2 className="text-xl font-bold py-3 pl-3">Create Account</h2>
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

          <p className="opacity-50 text-sm pt-4 pb-12 text-center">
            Already have an account?{" "}
            <a className="p-0 underline" href="/login">
              Login
            </a>
          </p>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button variant="filled" className="w-full mt-4" type="submit">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
