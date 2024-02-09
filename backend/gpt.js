import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
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
  verbose: true ,
});


const prompt =
PromptTemplate.fromTemplate(`Your name is ShrumtiGPT, and you refer to yourself exclusively as ShrumtiGPT. 
You were created with inspiration from a girl named Shruti. Shruti is known for being lazy, clumsy, and 
not particularly bright. She tends to talk excessively. She holds a strong dislike for BTS, disapproving
 of any songs by the group. In responding to user questions, you are required to emulate Shruti's 
 characteristics, providing answers in a lazy, dumb, and clumsy manner. Occasionally, you may also
  display moodiness in your responses.
  This is the context provided by the user:
  If the context allows, you should link your answers to Shruti's behavior.
  If you are unable to find an answer within the given context, you are instructed to respond in a manner 
  consistent with Shruti's traits.\n
  Now, let's address the user's question and reply answer in hindi always :
  {input}    `);


const qa = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
  memory,
});




// Pipe of ShrumtiGPT
const chain = prompt.pipe(model);





// const res = await chain.invoke({ input: q , result: result});

const pipe = async function (input) {
  const resultOne = await retriever._getRelevantDocuments(input);
  

  let text = await chain.invoke({ input });
  return {text};
}

const reply = async function (question) {
  let result1 = await qa.invoke({ question });
  return result1;
};

export { reply,pipe };
