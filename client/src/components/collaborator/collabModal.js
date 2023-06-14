import { Button, Chip, Modal, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { collabActions, collabContext } from '../../context/collabContext'
import { useAxios } from '../../hooks/useAxios';

export default function CollabModal() {
  const { postData } = useAxios();
  const { collabState, collabDispatch } = useContext(collabContext);
  const app_id = collabState.appData?.app_id ?? null;
  const [input, setInputs] = useState("");
  const [emailList, setEmailList] = useState([]);

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

  function handleClose() {
    collabDispatch({ type: collabActions.HIDE_COLLAB });
    setInputs("");
    setEmailList([]);
  }

  function handleInvite() {
    postData(`user/sendinvite/${app_id}`, emailList, () => handleClose());
  }

  return (
    <Modal disablePortal className='collabModalWrapper' open={collabState.isOpen} onClose={handleClose}>
      <div className='collabModalContainer'>
        <h2 className='collabModalTitle'>Invite Collabrator</h2>
        <div className='noAppIdMsg'>{app_id ? null : "Save Application First"}</div>

        <div className='fieldBtnContainer'>
          <div className='fieldWrapper'>
            <TextField fullWidth variant="outlined" color="secondary" placeholder="Email of Collabrator" name="collabEmail" value={input} onChange={handleChange} disabled={!app_id} onKeyUp={(e) => e.key === "Enter" && e.target.value && handleAdd()} />
          </div>

          <div className='addBtnWrapper'>
            {/* <p>{app_id ?? "N/A"}</p> */}
            <Button variant="outlined" color="secondary" onClick={handleAdd} disabled={!(input.length)}>Add</Button>
          </div>
        </div>

        <div className='emailList'>
          {emailList.map((data) => <Chip variant='outlined' label={data} onDelete={() => handleDlt(data)} />)}
        </div>

        <div className='sbmtBtnContainer'>
          <Button variant="outlined" color="secondary" disabled={!(emailList.length) || !app_id} onClick={handleInvite}>Invite</Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}
