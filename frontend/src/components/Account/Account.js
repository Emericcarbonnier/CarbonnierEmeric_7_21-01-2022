import functions from "../../_utils/_functions";
import {
  getEmailFromCrypto,
  deleteAccount,
  logout,
} from "../../_utils/auth/auth.functions";
import { userDeleted } from "../../_utils/toasts/users";
import { useHistory } from "react-router-dom";

const Account = ({ ...account }) => {
  const history = useHistory();

  const onClickDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this account?")) {
      if (account.isAdmin) {
        deleteAccount(account.id);
        userDeleted();
        account.onDeletedAccount();
        history.push(`/account/${account.id}`);
      } else {
        deleteAccount(account.id);
        logout();
        userDeleted();
        account.onLogout();
        history.push("/");
      }
    }
  };
  return (
    <div className="col-11 mb-5">
      <div className="card bg-dark text-white">
        <div className="card-header text-primary">
          <div className="justify-content-between align-items-center">
            <div className="justify-content-between align-items-center">
              <div className="ml-2 ">
                <div className="h5 m-0">@{account.surname}</div>
                <div className="h7 text-muted-primary">
                  {account.name} {account.surname}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-muted-primary h7 mb-4">
            {" "}
            <i className="fa fa-clock-o" />
            {" Membre depuis le " +
              functions.convertDateForHuman(account.createdAt)}
          </div>

          <h2 className="h5 card-title mb-4">Informations:</h2>
          <p className="card-text">Nom : {account.name}</p>
          <p className="card-text">Prénom: {account.surname}</p>
          <p className="card-text">
            Email: {getEmailFromCrypto(account.email)}
          </p>
        </div>
        <div className="card-footer mt-3">
          {account.canEdit === true && (
            <a
              href={"/account/" + account.id + "/edit"}
              className="card-link text-danger"
            >
              <i className="fa fa-edit"></i> Edit
            </a>
          )}
          {account.canEdit === true && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              href="#"
              className="card-link text-danger"
              onClick={onClickDeleteAccount}
            >
              <i className="fa fa-ban"></i> Effacer
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
