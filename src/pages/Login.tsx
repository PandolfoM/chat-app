import { signInWithEmailAndPassword } from "firebase/auth";
import Button from "../components/Button";
import { Input } from "../components/Input";
import { auth, db } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext, UserDocI } from "../auth/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import ProfilePicture from "../components/ProfilePicture";

const emailSchema = yup
  .object({
    email: yup.string().email("Invalid email").required("Required"),
  })
  .required();

const passwordSchema = yup
  .object({
    password: yup.string().required("Required"),
  })
  .required();

type EmailFormData = yup.InferType<typeof emailSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

function Login() {
  const { setCurrentUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<UserDocI | null>(null);
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const getUser = async (data: EmailFormData) => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", data.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        emailForm.setError("root", { message: "No user found" });
      }

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setUser(doc.data() as UserDocI);
        emailForm.reset();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (data: PasswordFormData) => {
    console.log(data);
    try {
      await passwordSchema.validate(data, { abortEarly: false });

      const signIn = await signInWithEmailAndPassword(
        auth,
        user?.email as string,
        data.password as string
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
    <div className="flex flex-col h-full gap-10">
      <div className="h-full flex flex-col items-center justify-end px-5 gap-10">
        <h1 className="text-4xl font-bold text-left w-full">
          {user ? (
            <>
              Welcome back!
              <br />
              {user.username}
            </>
          ) : (
            <>
              Welcome to
              <br /> Chat 👋
            </>
          )}
        </h1>
        {user && <ProfilePicture className="w-28 h-28" image={user.pfp} />}
      </div>
      <div className="bg-backgroundSecondary rounded-t-2xl h-full">
        <form
          className="flex flex-col gap-2 w-full h-full p-2"
          onSubmit={
            user
              ? passwordForm.handleSubmit(handleLogin)
              : emailForm.handleSubmit(getUser)
          }>
          <h2 className="text-xl font-bold py-3 pl-3">
            {user ? "Enter your password" : "Enter your email"}
          </h2>
          {user ? (
            <div>
              <Input
                placeholder="Password"
                type="password"
                {...passwordForm.register("password")}
              />
              <p className="text-sm text-error">
                {passwordForm.formState.errors.password?.message}
              </p>
            </div>
          ) : (
            <div>
              <Input placeholder="Email" {...emailForm.register("email")} />
              <p className="text-sm text-error">
                {emailForm.formState.errors.email?.message}
              </p>
            </div>
          )}

          {emailForm.formState.errors.root?.message && (
            <p className="text-sm text-error">
              {emailForm.formState.errors.root?.message}
            </p>
          )}

          <p className="opacity-50 text-sm pt-4 pb-12 text-center">
            Don't have an account?{" "}
            <a className="p-0 underline" href="/signup">
              Create an account
            </a>
          </p>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button
            variant="filled"
            className="w-full mt-4 shadow-xl"
            type="submit">
            Continue
          </Button>
          {user && (
            <Button
              variant="filled"
              className="w-full mt-2 bg-white text-black shadow-xl"
              onClick={() => setUser(null)}>
              Back
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
