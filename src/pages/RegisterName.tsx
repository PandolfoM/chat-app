import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useContext } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../auth/context";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";

const schema = yup
  .object({
    username: yup
      .string()
      .required("Required")
      .matches(
        /^[a-z0-9]+$/,
        "Username must be lowercase and contain only letters and numbers"
      ),
    displayName: yup.string().required("Required"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function RegisterName() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const saveUsername = async (data: FormData) => {
    try {
      if (currentUser) {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", "==", data.username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return setError("username", { message: "Username taken" });
        }

        await updateProfile(currentUser, {
          displayName: data.username.toLowerCase(),
        });

        await updateDoc(doc(db, "users", currentUser?.uid), {
          username: data.username.toLowerCase(),
          displayName: data.displayName,
        });

        navigate("/");
      } else {
        console.log("no user");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-10">
      <div className="h-full flex flex-col items-center justify-end px-5 gap-10">
        <h1 className="text-4xl font-bold text-left w-full">Welcome 👋!</h1>
        <ProfilePicture className="w-28 h-28" />
      </div>
      <div className="bg-backgroundSecondary rounded-t-2xl h-full">
        <form
          autoComplete="off"
          autoCapitalize="off"
          className="flex flex-col gap-2 w-full h-full p-2 pb-10 justify-between"
          onSubmit={handleSubmit(saveUsername)}>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold py-3 pl-3">Create a username</h2>
            <div>
              <Input
                placeholder="Username"
                {...register("username")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                }}
              />
              <p className="text-sm text-error">{errors.username?.message}</p>
            </div>
            <div>
              <Input placeholder="Display Name" {...register("displayName")} />
              <p className="text-sm text-error">
                {errors.displayName?.message}
              </p>
            </div>
          </div>
          <Button variant="filled" className="w-full mt-4" type="submit">
            Set Name
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterName;
