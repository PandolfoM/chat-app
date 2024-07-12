import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../auth/context";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    username: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function RegisterName() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [error, setError] = useState<string>("");
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const saveUsername = async (data: FormData) => {
    console.log(data.username);

    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: data.username,
        });

        console.log(currentUser);

        await updateDoc(doc(db, "users", currentUser?.uid), {
          username: data.username,
        });

        navigate("/");
      } else {
        throw Error("No current user");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full h-full justify-center p-2"
      onSubmit={handleSubmit(saveUsername)}>
      <h1 className="text-center text-xl">Create a username</h1>
      <div>
        <Input placeholder="Username" {...register("username")} />
        <p className="text-sm text-error">{errors.username?.message}</p>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      <Button variant="filled" className="w-full mt-4" type="submit">
        Set Name
      </Button>
    </form>
  );
}

export default RegisterName;
