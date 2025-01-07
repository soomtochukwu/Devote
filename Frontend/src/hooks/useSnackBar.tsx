import { useEffect, useState } from 'react';
import {
  messageInferface,
  messagesSelector,
  removeMessage,
  addMessage,
} from '../store/alertSlice';
import { useDispatch, useSelector } from 'react-redux';

const useSnackBar = () => {
  const [currentMessage, setCurrentMessage] = useState<messageInferface | null>(
    null
  );
  const dispatch = useDispatch();
  const messagesArray = useSelector(messagesSelector);

  useEffect(() => {
    if (messagesArray.length > 0 && !currentMessage) {
      setCurrentMessage(messagesArray[0]);
      dispatch(removeMessage());
    }
  }, [currentMessage, dispatch, messagesArray]);

  const removeCurrentMessage = () => setCurrentMessage(null);

  const showSuccessMessage = (successMessage?: string) => {
    dispatch(
      addMessage({ message: successMessage ?? 'Success', type: 'success' })
    );
  };

  const showErrorMessage = (errorMessage?: string) => {
    dispatch(addMessage({ message: errorMessage ?? 'Error', type: 'error' }));
  };

  return {
    currentMessage,
    removeCurrentMessage,
    showSuccessMessage,
    showErrorMessage,
  };
};

export default useSnackBar;
