import React, { useState } from "react";
import { toastMessagePosted } from "../../_utils/toasts/messages";
import "react-toastify/dist/ReactToastify.css";
import { REGEX } from "../../_utils/auth/auth.functions";
import { postMessage } from "../../_utils/messages/messages.functions";

const PostMessage = ({ onPost }) => {
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");

  async function SendData(e) {
    e.preventDefault();

    const response = await postMessage(titleValue, contentValue);
    if (response.ok) {
      onPost();
      setTitleValue("");
      setContentValue("");
      toastMessagePosted();
    }
  }

  return (
    <section className="row justify-content-center mb-5">
      <form
        className="col-11"
        encType="multipart/form-data"
        onSubmit={SendData}
      >
        <div className="card">
          <div className="card-header ">Publier un article</div>
          <div className="card-body">
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="posts">
                <div className="form-group">
                  <label className="sr-only" htmlFor="title">
                    title
                  </label>
                  <input
                    id="title"
                    required
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="Titre"
                    value={titleValue}
                    pattern={REGEX.TITLE_REGEX}
                    title="Character a à Z"
                    onChange={(event) => setTitleValue(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="sr-only" htmlFor="message">
                    post
                  </label>
                  <textarea
                    className="form-control"
                    required
                    id="message"
                    rows="3"
                    placeholder="Minimum 5 mots"
                    value={contentValue}
                    minLength="5"
                    onChange={(event) => setContentValue(event.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="btn-toolbar justify-content-between">
              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default PostMessage;
