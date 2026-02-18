/// <reference types="vite/client" />
/* eslint-disable no-var */

declare global {
    var mongoose: {
        conn: unknown;
        promise: Promise<unknown> | null;
    };
}

export { };
