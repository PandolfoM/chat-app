function User() {
  return (
    <div className="flex gap-2">
      <span className="w-11 h-11 aspect-square bg-primary text-white rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-warning">
        MP
      </span>
      <section className="flex items-center gap-2 w-full">
        <div className="flex flex-col w-full justify-end">
          <span className="flex justify-between">
            <p className="text-sm font-semibold">Matt Pandolfo</p>
            <p className="font-light text-xs text-black/60">8:44 PM</p>
          </span>
          <span className="flex justify-between">
            <p className="text-sm font-light">wanna lunch with me?</p>
            <p className="text-xs text-white font-light bg-error max-w-fit min-w-5 h-5 p-1 rounded-full flex items-center justify-center">
              2
            </p>
          </span>
        </div>
      </section>
    </div>
  );
}

export default User;
