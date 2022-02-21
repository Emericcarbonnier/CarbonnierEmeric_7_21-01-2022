import globalFunctions from "../../_utils/_functions";
import { deleteOneMessage } from "../../_utils/messages/messages.functions";

const Message = ({ ...message }) => {
  const onClickDeleteMessage = (e) => {
    e.preventDefault();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre message ?")) {
      deleteOneMessage(message.id);
      message.onErase();
      window.location.href = "/";
    }
  };
  return (
    <div className="card bg-dark text-white ">
      <div className="card-header">
        <div className="justify-content-between align-items-center">
          <div className="justify-content-between align-items-center">
            <div className="ml-2">
              <a
                className="card-link text-primary text-decoration-none"
                href={"/account/" + message.User.id}
              >
                <div className="h5 m-0 text-primary">@{message.User.surname}</div>
                <div className="h7 text-muted-primary ">
                  {message.User.name} {message.User.surname}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body ">
        <div className="text-primary h7 mb-2 ">
          {" "}
          <i className="fa fa-clock-o " />
          {" " + globalFunctions.convertDateForHuman(message.createdAt)}
        </div>
        <a className="card-link text-primary text-decoration-none" href={"/messages/" + message.id}>
          <h2 className=" h3 card-title text-white ">{message.title}</h2>
        </a>

        {message.teaserMessage ? (
          <p className="card-text text-teaser overflow-hidden">
            {message.content}
          </p>
        ) : (
          <p className="card-text">{message.content}</p>
        )}
      </div>
      <div className="card-footer">
        {message.canEdit === true && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href="#"
            className="card-link h5 text-danger"
            onClick={onClickDeleteMessage}
          >
            <i className="fa fa-ban"></i> Effacer
          </a>
        )}
      </div>
    </div>
  );
};

export default Message;
