import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Label } from "../components/Label";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../auth/context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "../components/ProfilePicture";
import upload from "../lib/upload";
import deleteFile from "../lib/deleteFile";

const schema = yup.object({
  status: yup
    .string()
    .oneOf(["online", "away", "dnd", "offline"], "Invalid status value")
    .optional(),
  statusMsg: yup.string().optional(),
  pfp: yup
    .mixed()
    .nullable()
    .notRequired()
    .test("fileSize", "File size is too large", (value: any) => {
      // Skip validation if no file is provided
      if (!value) return true;
      return value.size <= 8 * 1024 * 1024; // 8 MB
    })
    .test("fileType", "Unsupported file format", (value: any) => {
      // Skip validation if no file is provided
      if (!value) return true;
      return ["image/jpeg", "image/png"].includes(value.type);
    }),
});
type FormData = yup.InferType<typeof schema>;

function Settings() {
  const { currentUserDoc, setCurrentUserDoc, setIsLoading } =
    useContext(AuthContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { register, handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: currentUserDoc?.status,
      statusMsg: currentUserDoc?.statusMsg,
    },
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setValue("pfp", file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const { field: statusField } = useController({
    name: "status",
    control,
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if (!currentUserDoc) return;

    const userRef = doc(db, "users", currentUserDoc.id);

    try {
      const updates: any = {};

      if (data.pfp && data.pfp instanceof File) {
        const imgUrl = await upload(
          data.pfp,
          "profile-pics",
          `${currentUserDoc.username}-pfp`
        );
        updates.pfp = imgUrl;
        setImageSrc("");
      }

      // Conditionally add the status field if it has changed
      if (data.status !== currentUserDoc.status) {
        updates.status = data.status;
      }

      // Always add the statusMsg field
      updates.statusMsg = data.statusMsg || "";

      setCurrentUserDoc({
        ...currentUserDoc,
        status: data.status ? data.status : currentUserDoc.status,
        statusMsg: data.statusMsg ? data.statusMsg : "",
        pfp: updates.pfp,
      });
      await updateDoc(userRef, updates);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const removePfp = async () => {
    if (!currentUserDoc) return;
    setIsLoading(true);
    const userRef = doc(db, "users", currentUserDoc.id);
    try {
      setImageSrc("");
      setCurrentUserDoc({ ...currentUserDoc, pfp: "" });
      await deleteFile("profile-pics", `${currentUserDoc.username}-pfp`);
      await updateDoc(userRef, {
        pfp: "",
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const resetPfp = async () => {
    setImageSrc("");
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <h1 className="px-5 text-3xl font-extrabold">Settings</h1>
      <section className="bg-backgroundSecondary rounded-2xl p-3 mx-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full h-full justify-center p-2">
          <section className="flex flex-col justify-center gap-4">
            <div className="flex justify-center">
              <div className="relative">
                <ProfilePicture
                  className="w-28 h-28"
                  image={imageSrc ? imageSrc : null}
                />
                <span
                  className="absolute -bottom-3 -right-3 bg-white text-black w-10 h-10 aspect-square rounded-xl flex items-center justify-center cursor-pointer"
                  onClick={handleButtonClick}>
                  <FontAwesomeIcon icon={faImage} className="w-4 absolute" />
                  <Input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </span>
              </div>
            </div>
            {(imageSrc || currentUserDoc?.pfp) && (
              <Button
                variant="ghost"
                className="p-0 text-primary w-fit h-fit m-auto"
                onClick={imageSrc ? resetPfp : removePfp}>
                {imageSrc ? "Reset Profile Picture" : "Remove Profile Picture"}
              </Button>
            )}
          </section>
          <Label>Status</Label>
          <Select
            value={statusField.value}
            onValueChange={statusField.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="dnd">Do Not Disturb</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Label>Status Message</Label>
          <Input
            placeholder="Status Message"
            defaultValue={currentUserDoc?.statusMsg}
            {...register("statusMsg")}
          />
          <Button variant="filled" type="submit">
            Save
          </Button>
        </form>
      </section>
    </div>
  );
}

export default Settings;
