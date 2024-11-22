import { useDispatch, useSelector } from 'react-redux';
import { setUserId , clearUserId, setToken, setUserToken} from './ProfileSlice'; // Import the required action

export const useProfile = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.profile.id); // Correct syntax to access `id`
  const userToken = useSelector((state) => state.profile.userToken);
  const token = useSelector((state) => state.profile.Admintoken)

  const setUserIdHandler = (id) => {
    dispatch(setUserId(id)); // Dispatch the setUserId action with the new ID
  };

  const clearUserHandler = () => {
    dispatch(clearUserId());
  };

  const tokenHandler = (token) => {
    dispatch(setToken(token))
    localStorage.setItem( 'token' ,token);
  };

  const userTokenHandler = (token) => {
    dispatch(setUserToken(token))
    localStorage.setItem('UserToken', token);
  }
  

  return { userId, userToken, token, setUserId: setUserIdHandler, clearUserId: clearUserHandler, setUserToken: userTokenHandler, setAdminToken: tokenHandler };
};
