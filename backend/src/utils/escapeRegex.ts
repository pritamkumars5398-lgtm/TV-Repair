/** Escapes user input so it is matched literally inside a RegExp (e.g. "+91 98..." or "(") */
export const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
