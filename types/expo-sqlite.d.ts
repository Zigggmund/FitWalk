declare module 'expo-sqlite' {
  export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: SQLResultSetRowList;
  }

  export interface SQLResultSetRowList {
    length: number;
    item(index: number): any;
    _array: any[];
  }

  export interface SQLError {
    code: number;
    message: string;
  }

  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (tx: SQLTransaction, result: SQLResultSet) => void,
      errorCallback?: (tx: SQLTransaction, error: SQLError) => boolean
    ): void;
  }

  export interface Database {
    transaction(
      callback: (tx: SQLTransaction) => void,
      errorCallback?: (error: SQLError) => void,
      successCallback?: () => void
    ): void;
    closeAsync(): Promise<void>;
    exec(queries: Query[], readOnly: boolean): Promise<SQLResultSet[]>;
  }

  export interface Query {
    sql: string;
    args: any[];
  }

  export function openDatabase(
    name: string,
    version?: string,
    description?: string,
    size?: number,
    callback?: (db: Database) => void
  ): Database;
}