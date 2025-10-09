
export type ID = string;

export interface QueryFilter {
  field: string;
  op: "<" | "<=" | "==" | ">=" | ">" | "in" | "array-contains" | "array-contains-any";
  value: any;
}

export interface QueryOrder {
  field: string;
  direction?: "asc" | "desc";
}

export interface QueryOptions {
  where?: QueryFilter[];
  orderBy?: QueryOrder[];
  limit?: number;
}

export interface DB {
  getDoc: (collection: string, id: ID) => Promise<any | null>;
  list: (collection: string, opts?: QueryOptions) => Promise<any[]>;
  add: (collection: string, data: any, id?: ID) => Promise<ID>;
  set: (collection: string, id: ID, data: any) => Promise<void>;
  update: (collection: string, id: ID, patch: Partial<any>) => Promise<void>;
  remove: (collection: string, id: ID) => Promise<void>;
}
