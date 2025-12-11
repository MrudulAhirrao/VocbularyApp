import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import axios from 'axios';
import { NextRequest } from 'next/server';

// Local Cache to store words (works like a database for the demo)
let LOCAL_CACHE: any[] = [];

const typeDefs = gql`
  type Word {
    id: ID!
    text: String!
    lexicalCategory: String
    definition: String
    example: String
    audioUrl: String
    pronunciation: String
  }
  type Query {
    getWords: [Word]
    searchWords(query: String!): [Word]
  }
  type Mutation {
    addWord(text: String!): Word
  }
`;

const resolvers = {
  Query: {
    getWords: async () => {
      return [...LOCAL_CACHE].reverse();
    },
    searchWords: async (_: any, { query }: { query: string }) => {
      return LOCAL_CACHE.filter(w => w.text.toLowerCase().includes(query.toLowerCase())).reverse();
    },
  },
  Mutation: {
    addWord: async (_: any, { text }: { text: string }) => {
      const cleanText = text.trim().toLowerCase();

      // 1. Check Cache
      const existing = LOCAL_CACHE.find(w => w.text.toLowerCase() === cleanText);
      if (existing) return existing;

      console.log(`\n🚀 Processing Word: "${cleanText}"`);
      
      // --- DEBUGGING: CHECK IF KEYS ARE LOADED ---
      const appId = process.env.OXFORD_APP_ID;
      const appKey = process.env.OXFORD_APP_KEY;

      console.log("🔑 App ID Loaded:", appId ? "YES" : "NO");
      console.log("🔑 App Key Loaded:", appKey ? "YES" : "NO");

      if (!appId || !appKey) {
        throw new Error("SERVER ERROR: API Keys are missing in .env.local");
      }

      try {
        // 2. Use the SANDBOX URL (Exactly what worked in Postman)
        const url = `https://od-api-sandbox.oxforddictionaries.com/api/v2/entries/en-gb/${cleanText}`;
        
        console.log(`🌍 hitting: ${url}`);

        const response = await axios.get(url, {
          headers: {
            "app_id": appId,
            "app_key": appKey,
            "Accept": "application/json"
          }
        });

        const result = response.data.results?.[0];
        const entry = result?.lexicalEntries?.[0];
        const sense = entry?.entries?.[0]?.senses?.[0];
        const pron = entry?.entries?.[0]?.pronunciations?.[0];

        if (!result) throw new Error("API No Results");

        const newWord = {
          id: Date.now().toString(),
          text: result.word,
          lexicalCategory: entry?.lexicalCategory?.text || 'noun',
          definition: sense?.definitions?.[0] || 'No definition found',
          example: sense?.examples?.[0]?.text || '',
          audioUrl: pron?.audioFile || '',
          pronunciation: pron?.phoneticSpelling || ''
        };

        LOCAL_CACHE.push(newWord);
        console.log("✅ SUCCESS:", newWord.text);
        return newWord;

      } catch (error: any) {
        console.error("❌ API FAILED");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
            
            if (error.response.status === 404) {
               throw new Error(`Word '${cleanText}' not found in Sandbox. Try 'ace' or 'code'.`);
            }
        } else {
            console.error(error.message);
        }
        throw new Error("Failed to fetch word from Oxford API.");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };