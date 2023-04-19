export default interface User {
    userName: string;
    email: string;
    role: 'driver' | 'passenger' | 'manager';
    isAdmin: boolean;
}

export type DocumentData = { [field: string]: any };

