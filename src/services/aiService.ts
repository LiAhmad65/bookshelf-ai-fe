import OpenAI from "openai";

const baseURL = `${window.location.origin}/gemini-api/v1beta/openai/`;

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    baseURL:baseURL,
    dangerouslyAllowBrowser:true
})

export interface GeneratedBookInfo{
    author?:string,
    description?:string
}

export async function generateBookDescription(title:string, author?:string):Promise<GeneratedBookInfo | null>{
    if(!title) return null
    const prompt = `Given the book title "${title}"${author? ` by ${author}`:""}, generate a rich,
    engaging, and polished book description (3-4 sentences).

    Respond strictly in JSON format with the following keys:
    {
        "author": "Detected or confirmed author name",
        "description": "Engaging book description"
    }
    `;

    try {
        const response = await openai.chat.completions.create({
            model:"gemini-2.5-flash",
            messages:[{role:"user", content:prompt}],
            response_format:{type:"json_object"}
        })
        const content = response.choices[0].message.content ||"{}"
        if(!content) return null
        return JSON.parse(content) as GeneratedBookInfo;        
    } catch (error) {
        console.error("Error generating description", error)
        throw error
    }
}