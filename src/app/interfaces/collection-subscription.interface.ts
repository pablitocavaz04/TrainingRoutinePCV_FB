export interface CollectionChange<T> {
    type: 'added' | 'modified' | 'removed';
    data?: T;
    id: string;
  }
  