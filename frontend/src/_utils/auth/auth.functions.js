//Imports
import fetchApi from "../api/api.service";
import Cookies from "js-cookie";

import { userLogout } from "../toasts/users";

const CryptoJS = require("crypto-js");

// Variables
const REGEX = {
  NAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  SURNAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  TITLE_REGEX: "^([\\p{L}]+)([\\p{L}\\- ',]*)$",
  PASSWORD_REGEX: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$",
};

//Functions
function getEmailFromCrypto(email) {
  let DecryptedEmail = CryptoJS.AES.decrypt(
    email,
    "Secret Passphrase"
  ).toString(CryptoJS.enc.Utf8);
  return DecryptedEmail;
}

function isLogged() {
  const loggedIn = Cookies.get("groupomania");
  if (loggedIn === "true") {
    return true;
  } else {
    return false;
  }
}

function getIdFromCookie() {
  const groupomaniaId = Cookies.get("groupomaniaId");
  if (groupomaniaId) {
    return groupomaniaId;
  } else {
    return false;
  }
}

function login(email, password, page) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };

  return fetchApi("auth/login", page, requestOptions);
}

function signup(name, surname, email, password, page){
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: name,
      surname: surname,
      email: email,
      password: password,
    }),
  };

  return fetchApi("auth/signup", page, requestOptions);
}

async function logout(page) {
  Cookies.remove("groupomania");
  Cookies.remove("groupomaniaId");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return fetchApi("auth/logout", page, requestOptions)
    .then((response) => {
      console.log(response.json());
      if (response.ok) {
        userLogout();
      }
    })
    .catch((error) => console.log(error));
}

function getAccount(accountId, page) {
  const requestOptions = {
    method: "GET",
    credentials: "include",
  };
  return fetchApi(`auth/account/${accountId}`, page, requestOptions);
}

function editAccount(firstname, surname, accountId, page) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: firstname,
      surname: surname,
    }),
  };

  return fetchApi(`auth/account/${accountId}`, page, requestOptions);
}

function deleteAccount(accountId, page) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`auth/account/${accountId}`, page, requestOptions);
}

export {
  getEmailFromCrypto,
  REGEX,
  getAccount,
  editAccount,
  deleteAccount,
  getIdFromCookie,
  isLogged,
  logout,
  login,
  signup,
};
