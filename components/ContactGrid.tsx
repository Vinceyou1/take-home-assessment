import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { FirestoreContext } from './context/FirestoreContext';
import { UserContext } from './context/UserContext';
import { StorageContext } from './context/StorageContext';
import ContactInfo from './utility/ContactInfo';
import Image from 'next/image'

const ContactGrid = ({editContact}) => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const db = React.useContext(FirestoreContext);
  const user = React.useContext(UserContext);
  const storage = React.useContext(StorageContext);


  useEffect(() => {
    if (user[0] && db && storage) {
      const contactsRef = collection(db, 'users', user[0].uid, 'contacts');
      const unsubscribe = onSnapshot(contactsRef, async (snapshot) => {
        var contactsData: ContactInfo[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data() as DocumentData;
          const contact = new ContactInfo(
            data.name,
            data.lastContactDate.toDate(),
			      data.profilePhotoURL,
            doc.id,
            data.phoneNumber,
            data.email,
          );
          try {
            const profilePhotoRef = ref(storage, `users/${user[0].uid}/contacts/${doc.id}/${contact.profilePhotoURL}`);
            contact.profilePhotoURL = await getDownloadURL(profilePhotoRef);
          } catch (error) {
            console.error("Error fetching profile photo URL:", error);
          }

          contactsData.push(contact);
        }
        contactsData.sort((a, b) => {return b.lastContactDate.getTime() - a.lastContactDate.getTime();});
        setContacts(contactsData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, db, storage]);

  if (loading) {
    return <p>Loading contacts...</p>;
  }
  return (
    <div className={"grid grid-cols-1 gap-4 p-4 w-full" + (contacts.length ? "" : " flex-grow items-center justify-center")}>
      {contacts.length ? contacts.map(contact => (
        <div key={contact.contactId} className="flex items-center p-4 border rounded-lg shadow-md bg-white w-full flex-grow dark:bg-zinc-800/30">
          <img
            src={contact.profilePhotoURL || "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?w=300&ssl=1"}
            alt={contact.name}
            className="w-16 h-16 object-cover rounded-full mr-4"
          />
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col flex-grow">
			        <h2 className="text-lg font-semibold">{contact.name}</h2>
              <div className='text-sm flex flex-row space-x-4'>
                {contact.email && <><span>Email: {contact.email}</span> <span> | </span></>}
                {contact.phoneNumber && <><span>Phone: {contact.phoneNumber}</span><span> | </span></>}
                <span>Last Contact Date: {contact.lastContactDate.toLocaleDateString()}</span>
              </div>
            </div>
            <button onClick={() => editContact(contact.contactId)} className='p-4'>
              <Image className='dark:hidden' src="/pencil-edit-button.svg" alt="Edit" height={32} width={32}/>
              <Image className='hidden dark:inline-block' src="/pencil-edit-button dark.svg" alt="Edit" height={32} width={32}/>
            </button>
          </div>
          
        </div>
      )) : <h1 className='text-center lg:text-2xl'>Add a contact to get started!</h1>}
    </div>
  );
};

export default ContactGrid;
