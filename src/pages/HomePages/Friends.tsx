import { useContext, useEffect, useState } from "react";
import { AuthContext, UserDocI } from "../../auth/context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

enum Page {
  Online = "online",
  All = "all",
  Blocked = "blocked",
  Add = "add",
}

const schema = yup.object({
  search: yup.string().required("Required"),
});
type FormData = yup.InferType<typeof schema>;

function Friends() {
  const { currentUserDoc } = useContext(AuthContext);
  const [search, setSearch] = useState<string>("");
  const [friends, setFriends] = useState<UserDocI[]>([]);
  const [page, setPage] = useState<Page>(Page.Online);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    try {
      const friendIds = currentUserDoc?.friends;
      friendIds?.forEach(async (id) => {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as UserDocI;
          setFriends((prev) => [...prev, userData]);
        }
      });
    } catch (error) {}
  }, []);

  const handleAdd = async (data: FormData) => {
    try {
      console.log(data.search);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="px-5 text-3xl font-extrabold">Friends</h1>
      <section className="bg-backgroundSecondary/60 flex-1 rounded-t-2xl p-1 flex flex-col gap-2">
        <Tabs
          defaultValue={Page.Online}
          className="w-full"
          onValueChange={(value) => setPage(value as Page)}>
          <TabsList className="text-black/40 flex justify-between">
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black text-lg font-bold py-1">
              Online
            </TabsTrigger>
            <TabsTrigger
              value={Page.All}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black text-lg font-bold py-1">
              All
            </TabsTrigger>
            <TabsTrigger
              value={Page.Blocked}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black text-lg font-bold py-1">
              Blocked
            </TabsTrigger>
            <TabsTrigger
              value={Page.Add}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-success text-lg font-bold bg-success text-white py-1 rounded-xl">
              Add Friend
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="bg-backgroundSecondary p-2 h-full rounded-2xl">
          {page === Page.Add && (
            <>
              <form
                className="relative flex gap-2"
                onSubmit={handleSubmit(handleAdd)}>
                <Input placeholder="Search..." {...register("search")} />
                <Button type="submit" variant="filled" className="rounded-2xl ">
                  Send
                </Button>
              </form>
              {errors.search?.message && (
                <p className="text-sm text-error">{errors.search?.message}</p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Friends;
