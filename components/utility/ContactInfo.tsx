export default class ContactInfo {
	name: string;
	phoneNumber?: string;
	email?: string;
	lastContactDate: Date;
	profilePhotoURL: string;
	contactId: string;
	
  
	constructor(name: string, lastContactDate: Date, profilePhotoUrl:string, contactId: string, phoneNumber?: string, email?: string) {
	  this.name = name;
	  this.phoneNumber = phoneNumber;
	  this.profilePhotoURL = profilePhotoUrl;
	  this.contactId = contactId;
	  this.email = email;
	  this.lastContactDate = lastContactDate;
	}
  }
  