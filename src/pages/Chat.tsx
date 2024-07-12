import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../components/Textarea";

function Chat() {
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
      </section>
      <section className="m-5">
        <div className="bg-backgroundSecondary flex items-center gap-3 rounded-2xl px-5">
          <FontAwesomeIcon icon={faPlus} />
          <div className="flex-1">
            <Textarea
              placeholder="Type message..."
              className="bg-transparent border-l-2 rounded-none my-5 resize-none"
              minHeight={20}
              maxHeight={200}
            />
          </div>
          <FontAwesomeIcon icon={faMicrophone} />
        </div>
      </section>
    </div>
  );
}

export default Chat;
