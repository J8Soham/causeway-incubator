import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from 'src/app/core/store/app.store';
import { QueryParams, QueryOptions, AnyEntity } from 'src/app/core/store/app.model';
import { Course } from './course.model';

export class LoadCourse extends EntityLoadQuery<Course> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: Course) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('courses', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: Course) => EntityLoadQuery<AnyEntity>[]): LoadCourse {
    return new LoadCourse(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamCourse extends EntityStreamQuery<Course> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: Course) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('courses', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: Course) => EntityStreamQuery<AnyEntity>[]): StreamCourse {
    return new StreamCourse(store, queryParams, queryOptions, streamQueries);
  }
}

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<Course>('courses'),
);
