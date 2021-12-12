const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid')

const contactsPath = path.join(__dirname, 'db', 'contacts.json')

const listContacts = async () => {
  let data  
  try {
    data = await fs.readFile(contactsPath, 'utf8');    
    const result = JSON.parse(data);    
    return result
  } catch (error) {
    data = {ERROR: error.message}
    return data
  }  
}

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();    
    if (contacts.length===0) throw new Error("There are no contacts in phoneBook")
    const [contactById] = contacts.filter((contact) => contact.id === contactId);
    if (contactById === void 0) throw new Error(`There are no contacts with id="${contactId}"`)
    return contactById;
  } catch (error) {
    return {ERROR: error.message}
  }
  
}

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts()
    if (contacts.length===0) throw new Error("There are no contacts in phoneBook")
  const removingContactData = await getContactById(contactId)
  const newContactsArray = contacts.filter((contact) => contact.id !== contactId);  
  await fs.writeFile(contactsPath, JSON.stringify(newContactsArray, null, 2))
  return removingContactData;
  } catch (error) {
    return {ERROR: error.message}
  } 
}

const addContact = async (name, email, phone) => {
  try {    
    const contacts = await listContacts()
  const isExist = contacts.some(
    contact => contact.name.toLowerCase() === name.toLowerCase() || contact.phone === phone 
  )  
    if (isExist) throw new Error(`Adding parameters (${name} or ${phone}) is already in contacts`);
    const newContact = { name, email, phone, id: shortid.generate() }
    contacts.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return newContact;
  } catch (error) {
    return {ERROR: error.message}
  } 
}

module.exports = { listContacts, getContactById, removeContact, addContact }