import expect from 'expect';

import LodexParseQuery from './LodexParseQuery';

describe.only('LodexParseQuery', () => {
    it('should send default data', () => {
        const feed = {
            send: expect.createSpy(),
        };
        const data = {
            query: {},
        };
        LodexParseQuery.bind({ isLast: () => false })(data, feed);
        expect(feed.send).toHaveBeenCalledWith({
            query: { match: undefined, invertedFacets: [], facets: {} },
            limit: undefined,
            skip: undefined,
            maxValue: null,
            minValue: null,
            sort: { _id: 1 },
        });
    });

    it('should send parse query and send result', () => {
        const feed = {
            send: expect.createSpy(),
        };
        const data = {
            query: {
                match: 'match',
                invertedFacets: ['field'],
                field: 'value',
                maxValue: 10,
                minValue: 5,
                maxSize: 100,
                skip: 90,
                orderBy: 'field/asc',
            },
        };
        LodexParseQuery.bind({ isLast: () => false })(data, feed);
        expect(feed.send).toHaveBeenCalledWith({
            query: {
                match: 'match',
                invertedFacets: ['field'],
                facets: { field: 'value' },
            },
            limit: 100,
            skip: 90,
            maxValue: 10,
            minValue: 5,
            sort: { field: 1 },
        });
    });

    it('should send nothing if this.isLast return true and call feed.close instead', () => {
        const feed = {
            send: expect.createSpy(),
            close: expect.createSpy(),
        };
        const data = {
            query: {},
        };
        LodexParseQuery.bind({ isLast: () => true })(data, feed);
        expect(feed.send).toNotHaveBeenCalled();
        expect(feed.close).toHaveBeenCalled();
    });
});
