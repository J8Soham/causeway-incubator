// Entity Models
import { StudentProgress } from './student-progress/student-progress.model';
import { Subsubgoal } from './subsubgoal/subsubgoal.model';
import { Subgoal } from './subgoal/subgoal.model';
import { Role } from './role/role.model';
import { Course } from './course/course.model';
import { User } from './user/user.model';
import { UserContext } from './user-context/user-context.model';

export type AnyEntity =
  StudentProgress |
  Subsubgoal |
  Subgoal |
  Role |
  Course |
  User |
  UserContext;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryParams = [string, string, any][];

export type QueryOptions = {
  orderBy?: string | [string, string],
  limit?: number,
  startAt?: string,
  startAfter?: string,
  endAt?: string,
  endBefore?: string,
}
