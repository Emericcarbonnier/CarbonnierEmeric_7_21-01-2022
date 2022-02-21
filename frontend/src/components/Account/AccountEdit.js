import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  editAccount,
  getEmailFromCrypto,
  REGEX,
} from "../../_utils/auth/auth.functions";
import { userModified } from "../../_utils/toasts/users";

const EditAccount = ({ ...account }) => {
  const history = useHistory();
  const { id } = useParams();
  const [emailValue, setEmailValue] = useState(
    getEmailFromCrypto(account.email)
  );
  const [firstnameValue, setFirstnameValue] = useState(account.name);
  const [surnameValue, setSurnameValue] = useState(account.surname);

  const SendData = async (e) => {
    e.preventDefault();

    const response = await editAccount(firstnameValue, surnameValue, id);
    if (response.ok) {
      userModified();
      account.onPost();
      history.push(`/account/${account.id}`);
    }
  };

  return (
    <div className="col-11 mb-3">
      <div className="card bg-dark text-white">
        <div className="card-header text-primary">
          <div className="justify-content-between align-items-center">
            <div className="justify-content-between align-items-center">
              <div className="ml-2">
                <div className="h5m-0 text-primary">@{account.surname}</div>
                <div className="h7 text-muted-primary">
                  {account.name} {account.surname}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h2 className="h5 card-title text-center">Editer le Profil</h2>

          <form onSubmit={SendData}>
            <div className="form-group mb-4">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                className="form-control mt-2"
                placeholder="Nom"
                pattern={REGEX.NAME_REGEX}
                value={firstnameValue}
                required
                onChange={(event) => setFirstnameValue(event.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                className="form-control mt-2"
                placeholder="Prénom"
                pattern={REGEX.SURNAME_REGEX}
                value={surnameValue}
                required
                onChange={(event) => setSurnameValue(event.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control mt-2 bg-secondary"
                aria-label="readonly input example"
                placeholder="Enter email"
                value={emailValue}
                readOnly={true}
                onChange={(event) => setEmailValue(event.target.value)}
                disabled readonly
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
