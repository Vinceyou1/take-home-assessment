"use client"

import React from "react";
import { UserContext } from "@/components/context/UserContext";
import SigninPopup from "@/components/SigninPopup";
import { signOut } from "@/components/utility/Auth"
import ContactPopup from "@/components/ContactPopup";
import ContactGrid from "@/components/ContactGrid";


export default function Home() {
  const user = React.useContext(UserContext);
  const [popupOpen, setPopupOpen] = React.useState(false);
  // is the contact new or are we editing an old one
  const [isNew, setIsNew] = React.useState(false);
  const [selectedContactId, setSelectedContactId] = React.useState<string | null>(null);

  const editContact = (uuid : string) => {
    setSelectedContactId(uuid);
    setIsNew(false);
    setPopupOpen(true);
  };
  return (
    <main className="min-h-screen p-12 flex">
      <div className="flex-grow z-10 w-full font-mono text-sm ">
        <div className="min-h-full flex flex-col w-4/5 fixed ml-auto mr-auto top-0 items-center border-b border-gray-300 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:rounded-md lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-md lg:text-lg">
          {user[0] &&
          <div className="flex flex-row items-center justify-center">
            <p>Welcome, {user[0]?.displayName?.split(" ").at(0)}</p>
            <button onClick={() => {signOut()}}className="p-2 ml-8 rounded-sm border border-gray-300 dark:border-neutral-800">Sign Out</button>
          </div>
          }
          <div className="flex flex-row justify-between w-full pt-4 pl-12 pr-4">
            <div className="">
              <h1 className="text-xl lg:text-3xl font-bold">Contacts</h1>
            </div>
            <button onClick={() => {setPopupOpen(true); setIsNew(true)}} className="bg-blue-600 hover:bg-blue-700 duration-[50] ease-linear text-white pl-8 pr-8 pt-2 pb-2 rounded-lg text-lg lg:text-2xl font-bold group"><span className="inline-block group-hover:-translate-x-2 ease-in-out duration-100">+</span> Add Contact</button>
          </div>
          <ContactGrid editContact={editContact}/>
        </div>
      </div>
      <ContactPopup isOpen={popupOpen} isNew={isNew} onClose={() => setPopupOpen(false)} contactId={selectedContactId}/>
      <SigninPopup isOpen={!user[1] && !user[0]}/>
    </main>
  );
}
