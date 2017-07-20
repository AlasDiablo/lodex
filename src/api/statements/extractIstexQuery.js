import validUrl from 'valid-url';

function removeNumberInstance(uri) {
    const reg = new RegExp('(\\-\\d+)(\\.[a-z]+)+');
    const match = reg.exec(uri);

    if (match !== null) {
        return uri.replace(match[1], '');
    }

    return uri;
}

module.exports = function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const fields = this.getParam('fields', {});
    const config = this.getParam('config', {});

    const labels = config.istexQuery.labels.split(',');

    return fields
    .filter(field => field.format
         && field.format.name === 'istex')
    .forEach((field) => {
        const propertyName = field.name;

        if (!labels.includes(field.label) &&
            !(labels.length === 1 && labels[0] === '')) {
            return null;
        }

        const formatedUri = removeNumberInstance(data.uri);

        if (validUrl.isUri(data[propertyName])) {
            return feed.send({
                lodex: {
                    uri: formatedUri,
                },
                content: data[propertyName],
            });
        }

        /* the hostname will be replace in scroll */
        return feed.send({
            lodex: {
                uri: formatedUri,
            },
            content: `http://replace-api.fr/document/?q=${data[propertyName]}`,
        });
    });
};