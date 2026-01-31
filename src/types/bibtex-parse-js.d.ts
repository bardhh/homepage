declare module 'bibtex-parse-js' {
    const bibtexParse: {
        toJSON(content: string): unknown[];
    };
    export default bibtexParse;
}
