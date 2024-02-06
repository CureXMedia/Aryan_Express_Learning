import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { OPENAI_API_KEY,MONGODB_URI } from "./config.js";
const openAIApiKey = OPENAI_API_KEY;
const memory = new ConversationSummaryMemory({
  memoryKey: "chat_history",
  llm: new OpenAI({
    openAIApiKey,
    modelName: "gpt-3.5-turbo-0301",
    temperature: 0,
  }),
});


const client = new MongoClient(
  MONGODB_URI||  ""
);
const collection = client.db("vectoreStore").collection("shrumti");

const vectorStore = new MongoDBAtlasVectorSearch(
  new OpenAIEmbeddings({ openAIApiKey }),
  { collection }
);

const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    fetchK: 5,
    lambda: 0.5,
  },
});

const model = new OpenAI({
  openAIApiKey,
  streaming: true,
  modelName: "gpt-3.5-turbo-0301",
  temperature: 0.9,
  verbose: true,
});

const qa = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
  memory,
});
const reply = async function (question) {
  let result = await qa.invoke({ question });
  return result;
};

export { reply };

