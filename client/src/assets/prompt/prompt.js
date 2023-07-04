import { Alert, Modal, Snackbar } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { promptActions, promptContext } from '../../context/promptContext';

export default function Prompt() {
  const { promptState } = useContext(promptContext);

  useEffect(() => {
    console.debug(promptState);
  }, [promptState]);

  return (
    // <Modal open={promptState?.length > 0 ?? false}>
    //   <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={promptState?.length > 0 ?? false}>
    //     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    //       {promptState?.map((prompt) => (
    //         <CustAlert key={prompt.id} data={prompt} />
    //       ))}
    //     </div>
    //   </Snackbar>
    // </Modal>
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={promptState?.length > 0 ?? false}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {promptState?.map((prompt) => (
        <CustAlert key={prompt.id} data={prompt} />
      ))}
    </div>
    </Snackbar>
  );
}

function CustAlert({ data }) {
  const { promptDispatch } = useContext(promptContext);

  useEffect(() => {
    const timer = setTimeout(() => promptDispatch({ type: promptActions.HIDE_PROMPT, payload: data.id }), data.timer);
    return () => clearTimeout(timer);
  }, [data.id, data.timer, promptDispatch]);

  return (
    <Alert onClose={() => promptDispatch({ type: promptActions.HIDE_PROMPT, payload: data.id })} severity={data.type}>
      {data.message}
    </Alert>
  );
}