import React, { useState } from "react";
import { toastMessagePosted } from "../../_utils/toasts/messages";
import "react-toastify/dist/ReactToastify.css";
import { REGEX } from "../../_utils/auth/auth.functions";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const PostMessage = ({ onPost }) => {
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [imageValue, setImageValue] = useState(null);

  async function SendData(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageValue);
    formData.append("title", titleValue);
    formData.append("content", contentValue);

    const requestOptions = {
      method: "POST",
     credentials: "include",
      body: formData,
    };

    await fetch("http://localhost:3000/api/messages/new", requestOptions)
      .then((response) => {
        if (response.status !== 201) {
        } else {
          onPost();
          setTitleValue("");
          setContentValue("");
          setImageValue(null);
          toastMessagePosted();
        }
      })

      .catch((error) => console.log(error));
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
                <div className="mb-3">
                  <label className="form-label">
                    Default file input example
                  </label>
                  <input
                    className="form-control"
                    name="image"
                    type="file"
                    id="formFile"
                    onChange={(event) => setImageValue(event.target.files[0])}
                  />
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
