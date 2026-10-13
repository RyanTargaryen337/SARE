/** Typeform form IDs are short alphanumeric strings; anything else is ignored rather than put in a URL. */
export const isTypeformId = (id: string | undefined): id is string => !!id && /^[A-Za-z0-9]{4,32}$/.test(id);

export const typeformUrl = (id: string) => `https://form.typeform.com/to/${id}?typeform-medium=embed-snippet`;
