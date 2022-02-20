import fetchApi from "../api/api.service";
import { toastMessageDeleted } from "../toasts/messages";

function getMessages(page) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages`, page, requestOptions);
};

function getAllUserMessages(userId, page)  {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/userMessages/${userId}`, page, requestOptions);
};

function getOneMessage(messageId, page) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/${messageId}`, page, requestOptions);
};

function deleteOneMessage(messageId, page) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/${messageId}`, page, requestOptions).then(() =>
    toastMessageDeleted()
  );
};

function postMessage(title, content, page){
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  };

return fetchApi("messages/new", page, requestOptions);

}

export { getOneMessage, deleteOneMessage, getMessages, getAllUserMessages, postMessage };
