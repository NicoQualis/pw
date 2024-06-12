import { Pool, QueryResult } from "pg";
import mysql, { RowDataPacket } from 'mysql2/promise';

const poolPg = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env.DB_PG_USERNAME,
    password: process.env.DB_PG_PASSWORD,
    database: 'qualis_pw',
});

const poolMysql = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    database: 'qualis_pw',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export interface TableName {
    [key: string]: any;
};

export interface RowDataPacketGeneric<T extends TableName> extends RowDataPacket {
    [key: string]: T[keyof T] | any;
};

export const queryPg = <Table extends TableName>(textQuery: string, paramsQuery?: any[]): Promise<QueryResult<Table>> => {
    return poolPg.query<Table>(textQuery, paramsQuery);
};

export const queryMysql = async <Table extends TableName>(textQuery: string, paramsQuery?: any[]): Promise<RowDataPacketGeneric<Table>[]> => {
    const [rows] = await poolMysql.execute<RowDataPacket[]>(textQuery, paramsQuery);
    return rows as RowDataPacketGeneric<Table>[];
};