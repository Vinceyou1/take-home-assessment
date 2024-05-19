import React, { useEffect, useState, useContext } from 'react';
import { StorageContext } from './context/StorageContext';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { UserContext } from './context/UserContext';
import ContactInfo from './utility/ContactInfo';
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { FirestoreContext } from './context/FirestoreContext';

interface ContactPopupProps {
  isOpen: boolean;
  isNew: boolean;
  onClose: () => void;
  contactId?: string;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, isNew, onClose, contactId }) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useContext(UserContext);
  const db = useContext(FirestoreContext);
  const storage = useContext(StorageContext);
  const [lastSavedPhotoURL, setLastSavedPhotoURL] = useState("");

  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    new ContactInfo('', new Date(), '', '', '')
  );

  useEffect(() => {
    if(!isOpen) return;
    if (!isNew && contactId && user[0] && db && storage) {
      const fetchContact = async () => {
        const docRef = doc(db, 'users', user[0].uid, 'contacts', contactId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactInfo(new ContactInfo(
            data.name,
            data.lastContactDate.toDate(),
            data.profilePhotoURL,
            contactId,
            data.phoneNumber,
            data.email,
          ));
          const storageRef = ref(storage, `users/${user[0].uid}/contacts/${contactId}/${data.profilePhotoURL}`);
          const imageUrl = await getDownloadURL(storageRef);
          setImage(imageUrl);
          setLastSavedPhotoURL(data.profilePhotoURL);
        }
      };
      fetchContact();
    }
  }, [isNew, contactId, user, db, storage]);
  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
      setContactInfo(prevState => ({
        ...prevState,
        profilePhotoURL: selectedFile.name
      }));
    }
  };

  const ImageInput = () =>
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <img
          src={image || "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?w=300&ssl=1"}
          alt="Selected"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
        />
      </div>
      <p>Upload an Image</p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'lastContactDate') {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return;
      }
      setContactInfo(prevState => ({
        ...prevState,
        [name]: dateValue
      }));
    } else {
      setContactInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (contactInfo.name === "" || contactInfo.lastContactDate === new Date() || (!file && isNew)) {
      alert("Please include a name, last contact date, and photo for your contact.");
      return;
    }
    if (user[0] && db && storage) {
      setUploading(true);
      setError(null);
      try {
        let docRef;
        if (isNew) {
          docRef = await addDoc(collection(db, 'users', user[0].uid, 'contacts'), {
            name: contactInfo.name,
            phoneNumber: contactInfo.phoneNumber,
            email: contactInfo.email,
            lastContactDate: contactInfo.lastContactDate,
            profilePhotoURL: contactInfo.profilePhotoURL
          });
        } else {
          docRef = doc(db, 'users', user[0].uid, 'contacts', contactId!);
          await setDoc(docRef, {
            name: contactInfo.name,
            phoneNumber: contactInfo.phoneNumber,
            email: contactInfo.email,
            lastContactDate: contactInfo.lastContactDate,
            profilePhotoURL: contactInfo.profilePhotoURL
          });
        }

        if (file) {
          const storageRef = ref(storage, `users/${user[0].uid}/contacts/${docRef.id}/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          console.log('Profile photo URL:', downloadURL);
        }
        onClose();
      } catch (error) {
        alert('Save failed. Please try again.');
        console.error('Error saving contact info:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Save failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (user[0] && db && contactId && storage) {
      setUploading(true);
      setError(null);
      try {
        // Delete the contact document from Firestore
        const docRef = doc(db, 'users', user[0].uid, 'contacts', contactId);
        await deleteDoc(docRef);

        // Delete the profile photo from Firebase Storage
        if (contactInfo.profilePhotoURL) {
          const storageRef = ref(storage, `users/${user[0].uid}/contacts/${contactId}/${lastSavedPhotoURL}`);
          await deleteObject(storageRef);
        }
        close();
      } catch (error) {
        alert('Delete failed. Please try again.');
        console.error('Error deleting contact:', error);
      } finally {
        setUploading(false);
        onClose();
      }
    } else {
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2 h-fit dark:bg-zinc-800/30 bg-opacity-100">
        <button
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text:2xl lg:text-4xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-xl lg:text-3xl font-bold">{isNew ? "Create a New Contact" : "Edit Contact"}</h1>
        <div className='mt-8 text-md lg:text-xl flex flex-row justify-between'>
          <div className='flex-grow'>
            <label>Contact Name</label>
            <input
              type="text"
              name="name"
              value={contactInfo.name}
              onChange={handleInputChange}
              className="block w-3/4 pl-2 border-slate-400 border-2 dark:bg-zinc-800/30"
            />
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              className="block w-3/4 pl-2 border-slate-400 border-2 dark:bg-zinc-800/30"
            />
            <label>Phone #</label>
            <input
              type="tel"
              name="phoneNumber"
              value={contactInfo.phoneNumber}
              onChange={handleInputChange}
              className="block w-3/4 pl-2 border-slate-400 border-2 dark:bg-zinc-800/30"
            />
            <label>Last Contact Date</label>
            <input
              type="date"
              name="lastContactDate"
              value={contactInfo.lastContactDate.toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="block w-3/4 pl-2 border-slate-400 border-2 dark:bg-zinc-800/30"
            />
            {uploading ? (
              <p className="mt-4 py-2 px-4">Saving...</p>
            ) : (
              <div>
                <button
                  type="button"
                  className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleSave}
                >
                  Save
                </button>
                {!isNew && (
                  <button
                    type="button"
                    className="mt-4 py-2 px-4 ml-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <ImageInput />
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;
