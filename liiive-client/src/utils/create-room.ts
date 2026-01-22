import { customAlphabet } from 'nanoid';
import murmur from 'murmurhash';
import Sqids from 'sqids';
import { supabase } from '../supabase';
import type { Room } from '../types';

export const generateRoomId = (seed?: string) => {
  const alphabet = '1234567890abcdefghijklmnopqrstuvw';
  if (seed) {
    const sqids = new Sqids({ alphabet, minLength: 12 });
    return sqids.encode([murmur.v3(seed)]);
  } else {
    const nanoid = customAlphabet(alphabet, 12);
    return nanoid();
  }
}

export const createRoom = (
  url: string, 
  iiif_type: string,
  major_version: number,
  thumbnail?: string,
  pages?: number,
  name?: string,
  seed?: string
) => {
  const roomId = generateRoomId(seed);

  const getRoom = () => new Promise<Room>((resolve, reject) =>
    supabase.from('room')
      .select()
      .eq('id', roomId)
      .returns<Room[]>()
      .single()
      .then(({ data, error}) => {
        if (!data || error)
          reject(error);
        else
          resolve(data);
      }));

  const insertRoom = () => new Promise<Room>((resolve, reject) => 
    supabase.from('room')
      .insert({ 
        id: roomId,
        iiif_content: url,
        iiif_type,
        major_version,
        thumbnail,
        pages,
        name
      })
      .select()
      .returns<Room[]>()
      .single()
      .then(({ data, error}) => {
        if (!data || error)
          reject(error);
        else
          resolve(data);
      }));

  if (seed) {
    return getRoom().catch(() => insertRoom());
  } else {
    return insertRoom();
  }
}