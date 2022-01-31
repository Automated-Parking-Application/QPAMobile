import * as userActions from './user.action';
import * as authActions from './auth.action';

export const Actions = {
  ...authActions,
  ...userActions,
};
