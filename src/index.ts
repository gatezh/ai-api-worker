import { InferenceClient } from '@huggingface/inference';
import {  } from '@huggingface/tasks';
import { Env } from '../types';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders })
		}

		// Using Cloudflare's AI Gateway to access Hugging Face Inference API
		const hf = new InferenceClient(env.HF_API_KEY, {
			endpointUrl: "https://gateway.ai.cloudflare.com/v1/23fa6ebbdb145dbf47f95d219cfcb95d/chef-claude/huggingface"
		});

		const ingredientsString = await request.json();

		try {
			const chatCompletion = await hf.chatCompletion({
				model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
				messages: [
					{ role: 'system', content: SYSTEM_PROMPT },
					{
						role: 'user',
						content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
					},
				],
				max_tokens: 1024,
			});

			const response = chatCompletion.choices[0].message.content;
			return new Response(JSON.stringify(response), { headers: corsHeaders });

		} catch (error) {
			console.error('Error fetching recipe:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			return new Response(JSON.stringify({error: errorMessage}), { status: 500, headers: corsHeaders });
		}

	},
} satisfies ExportedHandler<Env>;
