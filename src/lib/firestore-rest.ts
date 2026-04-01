/**
 * @fileoverview Firestore REST Utility — CalcPro.NP
 * Used for fetching content in React Server Components (RSCs) without
 * initializing the full Firebase Client SDK.
 */

export async function fetchFirestoreCollection(collectionName: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const dbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';
  
  if (!projectId) {
    console.error('Firestore REST Error: Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    return [];
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}?pageSize=100`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 }, // ISR: Cache for 1 hour
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(`Firestore REST Error (${collectionName}):`, err);
      return [];
    }

    const data = await res.json();
    if (!data.documents) return [];

    return data.documents.map((doc: any) => {
      const f = doc.fields;
      const parsed: any = { id: doc.name.split('/').pop() };
      
      // Basic type parsing for Firestore REST format
      for (const key in f) {
        if (f[key].stringValue !== undefined) parsed[key] = f[key].stringValue;
        else if (f[key].integerValue !== undefined) parsed[key] = parseInt(f[key].integerValue);
        else if (f[key].booleanValue !== undefined) parsed[key] = f[key].booleanValue;
        else if (f[key].timestampValue !== undefined) parsed[key] = f[key].timestampValue;
        else if (f[key].arrayValue !== undefined) {
          parsed[key] = f[key].arrayValue.values?.map((v: any) => v.stringValue || v) || [];
        }
      }
      return parsed;
    });
  } catch (error) {
    console.error(`Firestore REST Fetch Failure (${collectionName}):`, error);
    return [];
  }
}
