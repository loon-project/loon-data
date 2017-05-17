
export class Util {

    public static asyncOrSyncFunctionWrap(func: (...args) => any) {
        try {
            const result = func();

        } catch (e) {
            throw e;
        }
    }
}