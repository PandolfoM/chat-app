import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faMicrophone,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../components/Textarea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/Button";
import { auth, db } from "../firebase";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../auth/context";
import { addDoc, collection, query, serverTimestamp } from "firebase/firestore";

const schema = yup
  .object({
    msg: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function Chat() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { currentUser } = useContext(AuthContext);
  const msgValue = watch("msg");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  const handleSend = async (data: FormData) => {
    console.log(data.msg);

    await addDoc(collection(db, "messages"), {
      text: data.msg,
      // name: currentUser?.displayName, //! wont update if user changes their name or pfp?
      // avatar: currentUser?.photoURL,
      createdAt: serverTimestamp(),
      uid: currentUser?.uid,
    });
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <section className="rounded-2xl bg-backgroundSecondary p-3 flex flex-col gap-3 overflow-y-auto w-full h-full relative">
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="bg-white w-fit max-w-[75%] px-3 py-1 rounded-2xl">
          hello world test test
          <p className="text-xs opacity-60 text-left pt-1">7:37 AM</p>
        </div>
        <div className="bg-primary text-white w-fit max-w-[75%] px-3 py-1 rounded-2xl self-end">
          epic message sent from matthew pandolfo awesome epic cool
          <p className="text-xs opacity-60 text-right pt-1">7:37 AM</p>
        </div>
        <div className="invisible" ref={endRef}></div>
      </section>
      <section className="m-5">
        <form
          className="bg-backgroundSecondary flex items-center gap-3 rounded-2xl px-5"
          onSubmit={handleSubmit(handleSend)}>
          <FontAwesomeIcon icon={faPlus} />
          <div className="flex-1">
            <Textarea
              placeholder="Type message..."
              className="bg-transparent border-l-2 rounded-none my-5 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(handleSend)();
                }
              }}
              minHeight={20}
              maxHeight={200}
              {...register("msg", {
                onChange: (e) => setValue("msg", e.target.value),
              })}
            />
          </div>
          {msgValue ? (
            <Button
              variant="ghost"
              type="submit"
              className="bg-primary w-5 h-5 p-3 rounded-full flex items-center justify-center text-white transition-all">
              <FontAwesomeIcon icon={faArrowUp} size="sm" />
            </Button>
          ) : (
            <div className="w-5 h-5 p-3 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faMicrophone} />
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default Chat;
