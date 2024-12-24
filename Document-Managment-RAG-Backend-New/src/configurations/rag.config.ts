export const ragConfig = () => {
    return {
        huggingFaceApiKey: process.env.HUGGINGFACEHUB_API_KEY,
        googleApiKey: process.env.GOOGLE_API_KEY,
        googleModelName: 'gemini-pro',
        chunkSize: 1000,
        chunkOverlap: 200,
        systemTemplate: [
            "You are an assistant for question-answering tasks.",
            "Use the following pieces of retrieved context to answer",
            "the question. If you don't know the answer, say that you",
            "don't know. Use three sentences maximum and keep the",
            "answer concise.",
            "\n\n",
            "{context}"
        ].join('\n')
    }
}
