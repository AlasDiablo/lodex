import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { Helmet } from 'react-helmet';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { END } from 'redux-saga';
import koaWebpack from 'koa-webpack';
import fs from 'fs';

import rootReducer from '../../app/js/public/reducers';
import sagas from '../../app/js/public/sagas';
import configureStoreServer from '../../app/js/configureStoreServer';
import routes from '../../app/js/public/routes';
import phrasesForEn from '../../app/js/i18n/translations/en';
import webpackConfig from '../../app/webpack.config.babel';

const indexHtml = fs
    .readFileSync(path.resolve(__dirname, '../../app/custom/index.html'))
    .toString();

const initialState = {
    fields: {
        loading: false,
        isSaving: false,
        byName: {},
        allValid: true,
        list: [],
        invalidFields: [],
        editedFieldName: undefined,
        editedValueFieldName: null,
        configuredFieldName: null,
        published: true,
    },
    polyglot: {
        locale: 'en',
        phrases: phrasesForEn,
    },
};

const renderFullPage = (html, preloadedState, helmet) =>
    indexHtml
        .replace(
            '<div id="root"></div>',
            `<div id="root"><div>${html}</div></div>`,
        )
        .replace(/<title>.*?<\/title>/, helmet.title.toString())
        .replace(
            '</head>',
            `${helmet.meta.toString()}
            ${helmet.link.toString()}
            </head>`,
        )
        .replace(
            '</body>',
            `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
                preloadedState,
            ).replace(/</g, '\\u003c')}</script>
            <script src="/index.js"></script>
            </body>`,
        );

const renderHtml = (store, renderProps, muiTheme) =>
    renderToString(
        <Provider {...{ store }}>
            <MuiThemeProvider muiTheme={muiTheme}>
                <RouterContext {...renderProps} />
            </MuiThemeProvider>
        </Provider>,
    );

const getPropsFromUrl = async ({ history, routes, location: url }) =>
    await new Promise((resolve, reject) => {
        match(
            { history, routes, location: url },
            (error, redirect, renderProps) => {
                if (error) {
                    return reject(error);
                }

                resolve({ redirect, renderProps });
            },
        );
    });

const handleRender = async ctx => {
    const { url, headers } = ctx.request;
    if (url === '/') {
        ctx.redirect('/home');
        return;
    }

    const muiTheme = getMuiTheme(
        {},
        {
            userAgent: headers['user-agent'],
        },
    );
    const history = createMemoryHistory(url);

    const { redirect, renderProps } = getPropsFromUrl({
        history,
        routes,
        location: url,
    });

    if (redirect) {
        ctx.redirect(redirect.pathname + redirect.search);
        return;
    }

    const store = configureStoreServer(
        rootReducer,
        sagas,
        initialState,
        history,
    );

    const sagaPromise = store.runSaga(sagas).done;

    renderHtml(store, renderProps, muiTheme);

    store.dispatch(END);

    await sagaPromise;

    const html = renderHtml(store, renderProps, muiTheme);
    const helmet = Helmet.renderStatic();
    const preloadedState = store.getState();

    ctx.body = renderFullPage(html, preloadedState, helmet);
};

const app = new Koa();

if (process.env.NODE_ENV === 'development') {
    app.use(
        koaWebpack({
            config: webpackConfig,
            dev: {
                publicPath: '/',
                stats: {
                    colors: true,
                },
                quiet: false,
                noInfo: true,
            },
            hot: {
                log: global.console.log,
                path: '/__webpack_hmr',
                heartbeat: 10 * 1000,
            },
        }),
    );
} else {
    app.use(mount('/', serve(path.resolve(__dirname, '../../build'))));
}

app.use(handleRender);

export default app;
