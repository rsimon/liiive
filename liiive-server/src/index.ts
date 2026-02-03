import { Server } from '@hocuspocus/server';
import * as Y from 'yjs'
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const server = new Server({
  name: 'hocuspocus',
  port: 1234,
  timeout: 30000,
  debounce: 5000,
  maxDebounce: 30000,
  quiet: false,
  onLoadDocument: async payload => {
    return supabase
      .storage
      .from('annotations')
      .download(`${payload.documentName}?bust=${Date.now()}`)
      .then(({ data, error }) => {
        if (data && !error) {
          data.arrayBuffer().then(buffer => {
            Y.applyUpdate(payload.document, new Uint8Array(buffer));
          });
        } else if (error) {
          console.error(JSON.stringify({ data, error }));
        }
      });
  },
  onStoreDocument: async payload => {
    const { document, documentName } = payload;

    document.broadcastStateless('saving');

    const state = Buffer.from(Y.encodeStateAsUpdate(document));
    return supabase
      .storage
      .from('annotations')
      .upload(documentName, state, {
        upsert: true,
        cacheControl: '0'
      })
      .then(({ error }) => {
        if (error) {
          document.broadcastStateless('saveError');
        } else {
          document.broadcastStateless('saved');
        }
      });
  }
});

server.listen();