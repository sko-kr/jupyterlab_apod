export function createRandomDate(startDate: Date, endDate: Date): string {
  const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return randomDate.toISOString().slice(0, 10);
}
