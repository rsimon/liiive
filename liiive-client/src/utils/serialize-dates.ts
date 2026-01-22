type HasTime = { created?: string | Date; updated?: string | Date; };

export const reviveDates = (item: HasTime) => {
  const revived = {...item};

  if (item.created && typeof item.created === 'string')
    revived.created = new Date(item.created);

  if (item.updated && typeof item.updated === 'string')
    revived.updated = new Date(item.updated);

  return revived;
}

export const serializeDates = <T extends HasTime>(item: HasTime): T => {
  const serialized = {...item};

  if (item.created instanceof Date)
    serialized.created = item.created.toISOString();

  if (item.updated instanceof Date)
    serialized.updated = item.updated.toISOString();

  return serialized as T;
}