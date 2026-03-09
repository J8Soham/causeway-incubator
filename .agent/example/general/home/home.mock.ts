import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalData, QuarterlyGoalData } from './home.model';

/** Hard-coded goal for WeeklyGoalsItemComponent tests. */
export const MOCK_GOAL: WeeklyGoalData = {
  __id: 'wg1',
  __userId: 'test-user',
  __quarterlyGoalId: 'qg1',
  __hashtagId: 'ht1',
  text: 'Finish Google Cover Letter',
  completed: false,
  order: 1,
  _createdAt: Timestamp.now(),
  _updatedAt: Timestamp.now(),
  _deleted: false,
  hashtag: {
    __id: 'ht1',
    name: 'coverletter',
    color: '#EE8B72',
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
};

/**
 * Hard-coded data of a user's incomplete weekly goals that
 * show up as editable in the form in WeeklyGoalsModal tests.
 */
export const MOCK_INCOMPLETE_GOALS: WeeklyGoalData[] = [
  {
    __id: 'wg1',
    __userId: '1',
    __quarterlyGoalId: 'qg1',
    __hashtagId: 'ht1',
    text: 'Finish Google Cover Letter',
    completed: false,
    order: 1,
    hashtag: {
      __id: 'ht1',
      name: 'coverletter',
      color: '#EE8B72',
    },
  },
  {
    __id: 'wg2',
    __userId: '1',
    __quarterlyGoalId: 'qg2',
    __hashtagId: 'ht2',
    text: 'Apply to Microsoft',
    completed: false,
    order: 2,
    hashtag: {
      __id: 'ht2',
      name: 'apply',
      color: '#2DBDB1',
    },
  },
];

/**
 * Hard-coded data of a user's incomplete quarterly goals that
 * show up as editable in the form in QuarterlyGoalsModal tests.
 */
export const MOCK_QUARTERLY_INCOMPLETE_GOALS: QuarterlyGoalData[] = [
  {
    __id: 'qg1',
    __userId: '1',
    __hashtagId: 'ht1',
    text: 'Finish cover letters',
    completed: false,
    order: 1,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht1',
      name: 'coverletter',
      color: '#EE8B72',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    weeklyGoalsTotal: 0,
    weeklyGoalsComplete: 0,
  },
  {
    __id: 'qg2',
    __userId: '1',
    __hashtagId: 'ht2',
    text: 'Apply to internships',
    completed: false,
    order: 2,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht2',
      name: 'apply',
      color: '#2DBDB1',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    weeklyGoalsTotal: 2,
    weeklyGoalsComplete: 1,
  },
];

/**
 * Hard-coded data of a user's quarterly goals, which is used to
 * populate the mat-select dropdown as hashtag options.
 */
export const MOCK_GOAL_DATAS: QuarterlyGoalData[] = [
  {
    __id: 'qg1',
    __userId: '1',
    __hashtagId: 'ht1',
    text: 'Finish cover letters',
    completed: false,
    order: 1,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht1',
      name: 'coverletter',
      color: '#EE8B72',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    weeklyGoalsTotal: 1,
    weeklyGoalsComplete: 0,
  },
  {
    __id: 'qg2',
    __userId: '1',
    __hashtagId: 'ht2',
    text: 'Apply to internships',
    completed: false,
    order: 2,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht2',
      name: 'apply',
      color: '#2DBDB1',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    weeklyGoalsTotal: 1,
    weeklyGoalsComplete: 0,
  },
  {
    __id: 'qg3',
    __userId: '1',
    __hashtagId: 'ht3',
    text: 'Technical interview prep!',
    completed: false,
    order: 3,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht3',
      name: 'interview',
      color: '#FFB987',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    weeklyGoalsTotal: 1,
    weeklyGoalsComplete: 1,
  },
];
