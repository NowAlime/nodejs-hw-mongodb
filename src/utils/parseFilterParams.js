const parseBoolean = (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'false'
        ? value.toLowerCase() === 'true'
        : undefined;
    }
  };
  
  const parseString = (value) => {
    return typeof value === 'string' && value.trim() !== ''
      ? value.trim()
      : undefined;
  };
  
  export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;
  
    const parsedType = parseString(type);
    const parsedIsFavourite = parseBoolean(isFavourite);
  
    return {
      type: parsedType,
      isFavourite: parsedIsFavourite,
    };
  };