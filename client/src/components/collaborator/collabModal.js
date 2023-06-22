import { Button, Chip, Modal, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { collabActions, collabContext } from '../../context/collabContext'
import { useListCollab, useMutateInvite } from './collabAPI';

export default function CollabModal() {
  const { collabState, collabDispatch } = useContext(collabContext);
  const app_id = collabState.appData?.app_id ?? null;

  function handleClose() {
    collabDispatch({ type: collabActions.HIDE_COLLAB });
  }

  return (
    <Modal disablePortal className='collabModalWrapper' open={collabState.isOpen} onClose={handleClose}>
      <div className='collabModalContainer'>
        {collabState.isOpen && <CollabComp handleClose={handleClose} app_id={app_id} />}
      </div>
    </Modal>
  )
}

function CollabComp({ handleClose, app_id }) {

  const invitedList = useListCollab(app_id); //React Query Fetch Request
  const addInvite = useMutateInvite(app_id); // React Query Post Request

  const [input, setInputs] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [invitedEmail, setInvitedEmail] = useState([]);
  const [removeEmail, setRemoveEmail] = useState([]);

  useEffect(() => {
    if (invitedList.data) {
      setInvitedEmail(invitedList.data.map((inviteUser) => ({ id: inviteUser.id, user_id: inviteUser.user_id, email: inviteUser.User.email })))
    }
  }, [invitedList.data]);

  function handleRemoveEmail(invitedData) {
    //**Add Email to Remove List */
    setRemoveEmail((prevEmails) => ([...prevEmails, invitedData]));
    //**Remove Email from Invited List */
    setInvitedEmail((prevEmails) => prevEmails.filter((email) => email !== invitedData))
  }

  function undoRemoveEmail(invitedData) {
    //**Add Email to Invited List */
    setInvitedEmail((prevEmails) => ([...prevEmails, invitedData]));
    //**Remove Email from Remove List */
    setRemoveEmail((prevEmails) => prevEmails.filter((email) => email !== invitedData))
  }

  function handleChange(e) {
    setInputs(e.target.value);
  }

  function handleAdd() {
    setEmailList((prevEmails => ([...prevEmails, input])));
    setInputs("");
  }

  function handleDlt(data) {
    setEmailList(emailList.filter(x => x !== data));
  }

  function handleInvite() {
    addInvite.mutate(
      { newEmail: emailList, deleteInvite: removeEmail },
      {
        onSuccess: () => {
          setEmailList([]);
          setRemoveEmail([]);
          handleClose();
        }
      }
    );
  }

  if (invitedList.isLoading) return <p>Loading</p>
  return (
    <>
      <h2 className='collabModalTitle'>Invite Collaborator</h2>
      <div className='noAppIdMsg'>{app_id ? null : "Save Application First"}</div>

      <div className='fieldBtnContainer'>
        <div className='fieldWrapper'>
          <TextField fullWidth variant="outlined" color="secondary" placeholder="Email of Collaborator" name="collabEmail" value={input} onChange={handleChange} autoFocus={true} disabled={!app_id} onKeyUp={(e) => e.key === "Enter" && e.target.value && handleAdd()} />
        </div>

        <div className='addBtnWrapper'>
          <Button variant="outlined" color="secondary" onClick={handleAdd} disabled={!(input.length)}>Add</Button>
        </div>
      </div>

      <div className='emailListContainer'>
        {invitedEmail.length !== 0 && <div className='emailList'>
          <p>Invited Users</p>
          <div className='chipContainer'>
            {invitedEmail.map((emailData) => (
              <div key={emailData.id}>
                <Chip variant='filled' label={emailData.email} onDelete={() => handleRemoveEmail(emailData)} />
              </div>
            ))}
          </div>
        </div>}

        {removeEmail.length !== 0 && <div className='emailList'>
          <p>Removed Users</p>
          <div className='chipContainer'>
            {removeEmail.map((emailData) => (
              <div key={emailData.id}>
                <Chip color='error' variant='outlined' label={emailData.email} onDelete={() => undoRemoveEmail(emailData)} />
              </div>
            ))}
          </div>
        </div>}

        {emailList.length !== 0 && <div className='emailList'>
          <p>New User</p>
          <div className='chipContainer'>
            {emailList.map((data, i) => (
              <div key={i}>
                <Chip variant='outlined' label={data} onDelete={() => handleDlt(data)} />
              </div>
            ))}
          </div>
        </div>}
      </div>

      <div className='sbmtBtnContainer'>
        <Button variant="outlined" color="secondary" disabled={!(emailList.length || removeEmail.length) || !app_id || addInvite.isLoading} onClick={handleInvite}>Invite</Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
      </div>
    </>
  )
}
