declare module 'bibtex-parse-js' {
    const bibtexParse: {
        toJSON(content: string): any[];
    };
    export default bibtexParse;
}
