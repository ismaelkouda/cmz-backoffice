import { UserModel } from 'src/domain/models/user.model';

export interface AuthState {
  data: UserModel | null;
}
export const initialState: AuthState = {
  data: null,
};