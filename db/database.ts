import { Pool, QueryResult } from "pg";

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'qualis_pw',
});

export interface TableName {
    [key: string]: any;
}

export const query = <Table extends TableName>(textQuery: string, paramsQuery?: any[]): Promise<QueryResult<Table>> => {
    return pool.query<Table>(textQuery, paramsQuery);
};