import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
  stream
    .pipe(ezs('filterVersions'))
    .pipe(ezs('filterContributions', { fields }))
    .pipe(ezs('extractIstexQuery', { fields }))
    .pipe(ezs('scroll'))
    .pipe(ezs('convertToExtendedNquads', { graph: `${config.host}/graph` }))
    .pipe(
      ezs((data, feed) => {
          console.log('Export NQUADS Extended', data);
          feed.end();
      }),
    );

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'extendednquads';

export default exporter;
