import { Avatar, AvatarGroup, Tooltip } from '@mui/material';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserIcon from '../../../assets/icons/userIcon';
import CalenderIcon from '../../../assets/icons/calenderIcon';
import { formatDate } from '../../../utils/globalFunctions/dateFns';
import { authContext } from '../../../context/authContext';
import { useAxios } from '../../../hooks/useAxios';

export default function Card({ app, ActionIcons }) {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const userdata = authState.userdata;

  const [moreOpen, setMoreOpen] = useState(false);
  const { getData } = useAxios();
  const mouseExit = () => setMoreOpen(false);

  function getCopyApplication(app_id, event) {
    event.stopPropagation();
    getData(`application/copy/${app_id}`, {},
      (data) => {
        navigate(`/application/edit/${data.app_id}`)
      });
  }

  return (
    <div className="appCard" onMouseLeave={mouseExit} onClick={() => navigate(`/application/view/${app.id}`)}>
      <span className="cardStatus">{app.application_status.status}</span>
      <h2>{app.project_name}</h2>
      <div className="categoryContainer">
        <p>{app.app_questions[0]?.answers[0]?.answer}</p>
      </div>
      {Boolean(app.application_invites?.length) && (
        <div className="collabContainer">
          <p>Collaborators</p>
          <div className="collabIcons">
            <AvatarGroup>
              {app.application_invites.map((invite) => {
                const initial = invite.User.first_name ?? "U";
                const email = invite.User.email;
                const fullName = `${invite.User.first_name ?? ""} ${invite.User.last_name ?? ""}`
                return (
                  <Tooltip key={invite.id} classes={{ popper: "cardTooltip" }} title={<><div>{fullName}</div><div>{email}</div></>} placement="top-start" arrow>
                    <Avatar sx={{ height: 24, width: 24 }}>{initial[0].toUpperCase()}</Avatar>
                  </Tooltip>
                )
              })}
            </AvatarGroup>
          </div>
        </div>
      )}
      <div className="cardDetails">
        <UserIcon />
        <p>{`${app.User.first_name} ${app.User.last_name}`}</p>
      </div>
      <div className="cardDetails">
        <CalenderIcon />
        <p>Last Edited on <b>{formatDate(app.updatedAt)}</b></p>
      </div>
      <img style={{ marginTop: 16 }} src="/images/icons/three_dot_blue.svg" alt="option" className="optionIcon" />
      <div className={`appCardActionContainer ${moreOpen ? "hovered" : ""}`}>
        <img src="/images/icons/eye_round.svg" alt="view" onClick={() => navigate(`/application/view/${app.id}`)} />
        {userdata.role_id === 1 && (
          <>
            {<img src="/images/icons/copy_round.svg" alt="copy" onClick={(event) => getCopyApplication(app.id, event)} />}
            {app.application_status_id === 1 && <img src="/images/icons/pencil_round.svg" alt="edit" onClick={(event) => { event.stopPropagation(); navigate(`/application/edit/${app.id}`) }} />}
          </>
        )}
      </div>
    </div>
  )
}
