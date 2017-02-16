import expect from 'expect';
import reducer, {
    defaultState,
    getToken,
    isLoggedIn,
    loginSuccess,
    toggleLogin,
    getRequest,
} from './';

describe('user reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the TOGGLE_LOGIN action', () => {
        const state = reducer(undefined, toggleLogin());
        expect(state).toEqual({
            ...state,
            showModal: true,
        });
    });

    it('should handle the LOGIN_SUCCESS action', () => {
        const state = reducer({ showModal: true }, loginSuccess('foo'));
        expect(state).toEqual({
            showModal: false,
            token: 'foo',
        });
    });

    describe('isLoggedIn selector', () => {
        it('should return false if state has no token', () => {
            const result = isLoggedIn({ user: {} });
            expect(result).toEqual(false);
        });

        it('should return true if state has a token', () => {
            const result = isLoggedIn({ user: { token: 'foo' } });
            expect(result).toEqual(true);
        });
    });

    describe('getToken selector', () => {
        it('should return the token from state', () => {
            const result = getToken({ user: { token: 'foo' } });
            expect(result).toEqual('foo');
        });
    });

    describe('getRequest selector', () => {
        it('should select config request with given token, url, body and method', () => {
            const result = getRequest({
                user: { token: 'token' },
            }, { url: 'url', method: 'method', body: { data: 'value' } });
            expect(result).toEqual({
                url: 'url',
                body: '{"data":"value"}',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                },
                method: 'method',
            });
        });
    });
});
