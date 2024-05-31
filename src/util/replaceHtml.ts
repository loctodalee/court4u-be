export const replacePlaceholder = (
  template: string,
  params: Record<string, string>
): string => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), params[key]);
  });
  return template;
};
