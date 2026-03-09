import { User } from 'src/app/core/store/user/user.model';
import { UserContext } from 'src/app/core/store/user-context/user-context.model';

export interface WaitlistData {
  currentUser: User;
  userContext: UserContext;
}
