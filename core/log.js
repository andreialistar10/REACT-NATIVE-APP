export const getLogger = tag =>
    message => console.log(`${tag} ${message}`);