import { useContext, useEffect, useState } from "react";
import { AuthContext, UserDocI } from "../../auth/context";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RequestsI, UserRequestsI } from "../../lib/interfaces";
import User from "../../components/User";

enum Page {
  Online = "online",
  All = "all",
  Blocked = "blocked",
  Pending = "pending",
  Add = "add",
}

const schema = yup.object({
  search: yup
    .string()
    .required("Required")
    .matches(
      /^[a-z0-9]+$/,
      "Username must be lowercase and contain only letters and numbers"
    ),
});
type FormData = yup.InferType<typeof schema>;

function Friends() {
  const { currentUserDoc } = useContext(AuthContext);
  const [search, setSearch] = useState<string>("");
  const [friends, setFriends] = useState<UserDocI[]>([]);
  const [requests, setRequests] = useState<RequestsI[]>([]);
  const [page, setPage] = useState<Page>(Page.Online);

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!currentUserDoc?.id) return;

    const fetchRequests = async () => {
      const unsub = onSnapshot(
        doc(db, "userfriendrequests", currentUserDoc.id),
        async (res) => {
          const data = res.data() as UserRequestsI;
          const userRef = collection(db, "users");

          const updatedRequests: RequestsI[] = [];

          for (const request of data.requests) {
            if (typeof request.to === "string") {
              const q = query(userRef, where("id", "==", request.to));
              const qSnapshot = await getDocs(q);

              qSnapshot.forEach((doc) => {
                updatedRequests.push({
                  ...request,
                  to: doc.data() as UserDocI,
                });
              });
            } else {
              updatedRequests.push(request);
            }
          }

          setRequests(updatedRequests);
        }
      );

      return () => unsub();
    };
    fetchRequests();
  }, []);

  const handleAdd = async (data: FormData) => {
    if (!currentUserDoc?.id) return;

    const requestsRef = collection(db, "userfriendrequests");

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", data.search)
      );
      const qSnapshot = await getDocs(q);

      qSnapshot.forEach(async (data) => {
        const userData: UserDocI = data.data() as UserDocI;
        if (userData.id === currentUserDoc.id)
          return setError("search", {
            message: "Cannot send a friend request to yourself",
          });

        await updateDoc(doc(requestsRef, currentUserDoc.id), {
          requests: arrayUnion({
            date: Date.now(),
            to: userData.id,
            status: "outgoing",
          }),
        });

        await updateDoc(doc(requestsRef, userData.id), {
          requests: arrayUnion({
            date: Date.now(),
            to: userData.id,
            status: "incoming",
          }),
        });

        reset({ search: "" });
        setError("search", {
          message: `Sent a friend request to ${userData.displayName}`,
        });

        setTimeout(() => {
          reset();
        }, 10000);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const cancelFriend = async () => {
    console.log("cancel");
  };

  return (
    <>
      <h1 className="px-5 text-3xl font-extrabold">Friends</h1>
      <section className="bg-backgroundSecondary/60 flex-1 rounded-t-2xl p-1 flex flex-col gap-2">
        <Tabs
          defaultValue={Page.Online}
          className="w-full"
          onValueChange={(value) => setPage(value as Page)}>
          <TabsList className="text-black/40 flex justify-between overflow-hidden">
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black font-bold py-1">
              Online
            </TabsTrigger>
            <TabsTrigger
              value={Page.All}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black font-bold py-1">
              All
            </TabsTrigger>
            <TabsTrigger
              value={Page.Blocked}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black font-bold py-1">
              Blocked
            </TabsTrigger>
            <TabsTrigger
              value={Page.Pending}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black font-bold py-1">
              Pending
            </TabsTrigger>
            <TabsTrigger
              value={Page.Add}
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-success  font-bold bg-success text-white py-1 rounded-xl">
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
                <Input
                  placeholder="Search..."
                  {...register("search")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "");
                  }}
                />
                <Button type="submit" variant="filled" className="rounded-2xl ">
                  Send
                </Button>
              </form>
              {errors.search?.message && (
                <p className="text-sm text-success">{errors.search?.message}</p>
              )}
            </>
          )}
          {page === Page.Pending && (
            <>
              <div>
                {requests.map((req, index) => (
                  <div key={index}>
                    {typeof req.to === "string" ? (
                      req.to
                    ) : (
                      <User
                        user={req.to}
                        friendReq={req}
                        cancelFunc={cancelFriend}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Friends;
