/** Tiny helpers shared by the admin API route handlers. */

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Nenumatyta klaida.';
}
